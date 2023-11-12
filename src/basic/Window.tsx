import { atom, localSync } from "@cn-ui/reactive";
import { createDraggable } from "@neodrag/solid";
import { JSXElement } from "solid-js";
export const Window = (props: { name: string; children: JSXElement }) => {
    const { draggable } = createDraggable();
    const position = atom({
        x: 0,
        y: 0,
    });
    localSync(position, "window_" + props.name);
    return (
        <section
            use:draggable={{
                handle: ".window-handle",
                defaultPosition: position(),
                onDragEnd: (data) => {
                    position({ x: data.offsetX, y: data.offsetY });
                },
            }}
            class="flex w-[40rem] h-[25rem] flex-col border border-gray-400 rounded overflow-hidden">
            <HeaderBar></HeaderBar>
            {props.children}
        </section>
    );
};
export const HeaderBar = () => {
    return (
        <header class="flex h-8 items-center window-handle bg-gray-50 px-2">
            <div class="flex gap-2 items-center">
                <button class="h-3 w-3 rounded-full bg-red-400"></button>
                <button class="h-3 w-3 rounded-full bg-yellow-400"></button>
                <button class="h-3 w-3 rounded-full bg-green-400"></button>
            </div>
        </header>
    );
};
