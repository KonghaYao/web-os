import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { onCleanup, onMount } from "solid-js";
import { AttachAddon } from "xterm-addon-attach";
import { atom, localSync } from "@cn-ui/reactive";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { theme } from "./theme.ts";
import { Window } from "../../basic/Window.tsx";
import { MenuList } from "./MenuList.tsx";
export function WebTerminal() {
    const dom = atom<HTMLDivElement | null>(null);
    const socketURL = atom("");
    localSync(socketURL, "WEB_OS_SOCKET_URL");

    let term: Terminal;
    onMount(() => {
        do {
            try {
                term = createTerminal(socketURL());
            } catch (e: unknown) {
                confirm((e as Error).message);
                socketURL(
                    () => prompt("请输入 WEB OS 的 WebSocket 端口地址") || ""
                );
            }
        } while (!term);
        term.open(dom()!);
        // term.fit();
        console.log(term);
    });
    onCleanup(() => {
        term.dispose();
    });
    return (
        <Window name="terminal" menuList={MenuList}>
            <div ref={dom}></div>;
        </Window>
    );
}

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
    term.loadAddon(new AttachAddon(ws));
    term.loadAddon(new FitAddon());
    term.loadAddon(new WebLinksAddon());
    return term;
};
