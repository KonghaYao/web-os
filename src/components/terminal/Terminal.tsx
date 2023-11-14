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
import { Window } from "../../basic/Window.tsx";
import { MenuList } from "./MenuList.tsx";
import { useResizeObserver } from "solidjs-use";
export const WebTerminal = () => {
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
                    () => prompt("请输入 WEB OS 的 WebSocket 端口地址") || ""
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
};

const createTerminal = (socketURL: string) => {
    const term = new Terminal({
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 16,
        theme,
        smoothScrollDuration: 100,
        convertEol: true,
        cursorBlink: true,
        macOptionIsMeta: true,
        allowProposedApi: true,
    });

    term.focus();
    const ws = new WebSocket(socketURL);
    const fit = new FitAddon();
    term.loadAddon(new AttachAddon(ws));
    term.loadAddon(fit);
    term.loadAddon(new WebLinksAddon());
    term.loadAddon(new SearchAddon());
    term.loadAddon(new CanvasAddon());
    return { term, fit, ws };
};
