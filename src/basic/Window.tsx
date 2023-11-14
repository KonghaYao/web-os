import { Atom, atom, localSync, reflect } from "@cn-ui/reactive";
import { createDraggable } from "@neodrag/solid";
import { useFullscreen } from "solidjs-use";
import {
    Component,
    JSXElement,
    createContext,
    onCleanup,
    onMount,
    useContext,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { SystemMenuList } from "../components/system/Menu/SystemMenuList";
import { SystemContext } from "../components/system";
import mitt, { Emitter } from "mitt";
export const WindowContext = createContext<{
    headerSlot: Atom<Component>;
    sideSlot: Atom<Component>;
    menuList: Atom<SystemMenuList>;
    event: Emitter<Record<string, unknown>>;
}>();

export const Window = (props: {
    name: string;
    children: JSXElement;
    menuList: SystemMenuList;
}) => {
    const system = useContext(SystemContext)!;
    const menuList = atom(props.menuList);
    const focusWindow = () => {
        system.menuList(menuList());
        system.event(event);
    };
    onMount(() => {
        focusWindow();
    });
    const { draggable } = createDraggable();
    const position = atom({
        x: 0,
        y: 0,
    });
    localSync(position, "window_" + props.name);
    const event = mitt();
    onCleanup(() => {
        event.off("*");
    });
    return (
        <WindowContext.Provider
            value={{
                headerSlot: atom<Component>(() => null),
                sideSlot: atom<Component>(() => null),
                menuList: atom(props.menuList),
                event,
            }}>
            <section
                use:draggable={{
                    handle: ".window-handle",
                    defaultPosition: position(),
                    onDragEnd: (data) => {
                        position({ x: data.offsetX, y: data.offsetY });
                    },
                    bounds: {
                        top: 32,
                        left: -Infinity,
                        right: -Infinity,
                        bottom: -Infinity,
                    },
                }}
                onmousedown={() => {
                    focusWindow();
                }}
                class="bg-gray-50/70 shadow-lg shadow-black/25 flex w-[40rem] h-[25rem] flex-col border border-gray-400 rounded-lg overflow-hidden relative cursor-default select-none">
                <HeaderBar></HeaderBar>
                {props.children}
            </section>
        </WindowContext.Provider>
    );
};
export const HeaderBar = () => {
    const window = useContext(WindowContext)!;
    const header = atom<HTMLDivElement | null>(null);
    /** 通过 HTML 位置获取主元素 */
    const main = reflect(() => header()?.nextElementSibling! as HTMLElement);
    const fullScreen = useFullscreen(main);
    return (
        <header
            class="flex h-8 flex-none items-center window-handle px-2 select-none"
            ref={header}>
            <div class="flex gap-2 items-center">
                <button class="h-3 w-3 rounded-full bg-red-400"></button>
                <button
                    class="h-3 w-3 rounded-full bg-yellow-400"
                    onclick={() => {}}></button>
                <button
                    class="h-3 w-3 rounded-full bg-green-400"
                    onclick={() => {
                        fullScreen.toggle();
                    }}></button>
            </div>
            <Dynamic component={window.headerSlot()}></Dynamic>
        </header>
    );
};

/** 在 Window 中注册元素到固定的 Slot */
export const RegisterWindow = (props: {
    name: "headerSlot" | "sideSlot";
    children: JSXElement;
}) => {
    const window = useContext(WindowContext)!;
    window[props.name](() => () => props.children);
    return null;
};

export const defineWindowComponent = (
    config: {
        name: string;
        menuList: SystemMenuList;
    },
    comp: Component
) => {
    return () => (
        <Window {...config}>
            <Dynamic component={comp}></Dynamic>
        </Window>
    );
};
