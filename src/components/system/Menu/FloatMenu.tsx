import { Show, useContext } from "solid-js";
import { atom } from "@cn-ui/reactive";
import { useElementHover } from "solidjs-use";
import {
    SystemMenuAction,
    SystemMenuFloatBtn,
    SystemMenuItemConfig,
} from "./SystemMenuList";
import { SystemContext } from "..";

/** 系统左上角的浮动菜单组件 */
export const FloatMenu = (props: SystemMenuItemConfig) => {
    const system = useContext(SystemContext)!;
    // 菜单列表的样式
    const listClass =
        "flex flex-col gap-2 rounded-lg p-1  w-[12rem] backdrop-blur shadow bg-gray-200/70 z-10 ";

    // 鼠标悬停时按钮的样式
    const hoverButton =
        "rounded hover:bg-blue-500 hover:text-white text-black transition-colors ";

    return (
        <div class={listClass + "absolute top-[110%] -left-[5%]"}>
            {(props as SystemMenuFloatBtn).actions?.map((i) => {
                // 定义菜单元素
                const el = atom<HTMLDivElement | null>(null);
                // 检测鼠标是否悬停在菜单元素上
                const isHovered = useElementHover(el, { delayLeave: 150 });
                const getEvent = () => system.focusingWindow().event;
                return (
                    <button
                        ref={el}
                        class={
                            "relative " + (isHovered() ? " bg-blue-200  " : "")
                        }>
                        <div
                            class={"h-full w-full " + hoverButton}
                            onclick={() => {
                                i.key && getEvent()?.emit(i.key);
                            }}>
                            {i.label}
                        </div>
                        <Show when={(i as any).actions && isHovered()}>
                            <div
                                class={
                                    listClass +
                                    " shadow-lg absolute top-0 left-[95%]"
                                }>
                                {(i as SystemMenuFloatBtn).actions?.map(
                                    (_ii) => {
                                        const ii = _ii as SystemMenuAction;
                                        return (
                                            <button
                                                class={hoverButton}
                                                onclick={() => {
                                                    ii.key &&
                                                        getEvent()?.emit(
                                                            ii.key
                                                        );
                                                }}>
                                                {ii.label}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </Show>
                    </button>
                );
            })}
        </div>
    );
};
