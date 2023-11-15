import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { onCleanup, onMount } from "solid-js";
import { AttachAddon } from "@xterm/addon-attach";
import { atom, localSync } from "@cn-ui/reactive";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { SearchAddon } from "@xterm/addon-search";
import { CanvasAddon } from "@xterm/addon-canvas";
import { theme } from "./theme.ts";
import { defineWindowComponent } from "../../basic/Window.tsx";
import { MenuList } from "./MenuList.tsx";
import { useResizeObserver } from "solidjs-use";

export const WebTerminal = defineWindowComponent(
    { name: "terminal", menuList: MenuList },
    () => {
        const dom = atom<HTMLDivElement | null>(null);
        const socketURL = atom("");
        localSync(socketURL, "WEB_OS_SOCKET_URL");

        let terminal: ReturnType<typeof createTerminal>;
        onMount(() => {
            do {
                try {
                    terminal = createTerminal(socketURL());
                } catch (e: unknown) {
                    confirm((e as Error).message);
                    socketURL(
                        () =>
                            prompt("请输入 WEB OS 的 WebSocket 端口地址") || ""
                    );
                }
            } while (!terminal);
            terminal.term.open(dom()!);
        });
        onCleanup(() => {
            terminal?.term.dispose();
        });
        useResizeObserver(dom, () => {
            if (terminal) terminal.fit.fit();
        });
        return <div class="h-full w-full" ref={dom}></div>;
    }
);
/**
 * 创建一个终端实例
 *
 * @param socketURL - WebSocket的URL
 * @returns 终端实例、适应插件、WebSocket实例
 */
const createTerminal = (socketURL: string) => {
    const term = new Terminal({
        fontFamily: 'Menlo, Monaco, "Courier New", monospace', // 设置字体类型
        fontSize: 16, // 设置字体大小
        theme, // 设置主题
        smoothScrollDuration: 100, // 设置平滑滚动的持续时间
        convertEol: true, // 转换行尾
        cursorBlink: true, // 设置光标闪烁
        macOptionIsMeta: true, // 设置Mac上的Option键作为Meta键
        allowProposedApi: true, // 允许使用建议的API
    });

    term.focus(); // 设置焦点

    const ws = new WebSocket(socketURL); // 创建WebSocket实例

    const fit = new FitAddon(); // 创建适应插件实例
    term.loadAddon(new AttachAddon(ws)); // 加载附加插件
    term.loadAddon(fit); // 加载适应插件
    term.loadAddon(new WebLinksAddon()); // 加载Web链接插件
    term.loadAddon(new SearchAddon()); // 加载搜索插件
    term.loadAddon(new CanvasAddon()); // 加载画布插件

    return { term, fit, ws }; // 返回终端实例、适应插件、WebSocket实例
};
