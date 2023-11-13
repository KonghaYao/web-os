import { Show } from "solid-js";
import { atom } from "@cn-ui/reactive";
import { useElementHover } from "solidjs-use";
import { SystemMenuAction } from "./SystemMenuList";

/** 系统左上角的浮动菜单组件 */
export const FloatMenu = (props: SystemMenuAction) => {
    // 菜单列表的样式
    const listClass =
        "flex flex-col gap-2 rounded-lg p-1  w-[12rem] backdrop-blur shadow bg-gray-200/70 z-10 ";

    // 鼠标悬停时按钮的样式
    const hoverButton =
        "rounded hover:bg-blue-500 hover:text-white text-black transition-colors ";

    return (
        <div class={listClass + "absolute top-[110%] -left-[5%]"}>
            {props.actions?.map((i) => {
                // 定义菜单元素
                const el = atom<HTMLDivElement | null>(null);
                // 检测鼠标是否悬停在菜单元素上
                const isHovered = useElementHover(el, { delayLeave: 150 });

                return (
                    <button
                        ref={el}
                        class={
                            "relative " + (isHovered() ? " bg-blue-200  " : "")
                        }>
                        <div class={"h-full w-full " + hoverButton}>
                            {i.label}
                        </div>
                        <Show when={isHovered()}>
                            <div
                                class={
                                    listClass +
                                    " shadow-lg absolute top-0 left-[95%]"
                                }>
                                {i.actions?.map((ii) => {
                                    return (
                                        <button class={hoverButton}>
                                            {ii.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </Show>
                    </button>
                );
            })}
        </div>
    );
};
