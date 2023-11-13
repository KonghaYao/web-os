import { ArrayAtomType, Atom, atom, localSync, reflect } from "@cn-ui/reactive";
import { createDraggable } from "@neodrag/solid";
import { useFullscreen } from "solidjs-use";
import {
    Component,
    Context,
    JSXElement,
    createContext,
    useContext,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { GetContextInner } from "./type-utils";

export const WindowContext = createContext<{
    headerSlot: Atom<Component>;
    sideSlot: Atom<Component>;
}>();

export const Window = (props: { name: string; children: JSXElement }) => {
    const { draggable } = createDraggable();
    const position = atom({
        x: 0,
        y: 0,
    });
    localSync(position, "window_" + props.name);
    return (
        <WindowContext.Provider
            value={{
                headerSlot: atom<Component>(() => null),
                sideSlot: atom<Component>(() => null),
            }}>
            <section
                use:draggable={{
                    handle: ".window-handle",
                    defaultPosition: position(),
                    onDragEnd: (data) => {
                        position({ x: data.offsetX, y: data.offsetY });
                    },
                    bounds:{
                        top: 32,
                        left: -Infinity,
                        right: -Infinity,
                        bottom: -Infinity
                    }
                }}
                class="bg-gray-50/70 shadow-lg shadow-black/25 flex w-[40rem] h-[25rem] flex-col border border-gray-400 rounded overflow-hidden relative cursor-default select-none">
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
            class="flex h-8 items-center window-handle px-2 select-none"
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
    name: keyof GetContextInner<typeof WindowContext>;
    children: JSXElement;
}) => {
    const window = useContext(WindowContext)!;
    window[props.name](() => () => props.children);
    return null;
};
