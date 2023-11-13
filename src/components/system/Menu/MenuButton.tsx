import { Show } from "solid-js";
import { atom } from "@cn-ui/reactive";
import { useElementHover } from "solidjs-use";
import { FloatMenu } from "./FloatMenu";
import { SystemMenuAction } from "./SystemMenuList";

export const MenuButton = (props: SystemMenuAction) => {
    const target = atom<HTMLDivElement | null>(null);

    const show = useElementHover(target, { delayLeave: 150 });
    return (
        <button
            ref={target}
            class={
                "relative px-2 transition-colors rounded-md h-full" +
                (show() ? " bg-gray-500/40 " : "")
            }>
            <span>{props.label}</span>
            <div>
                <Show when={show()}>
                    <FloatMenu {...props}></FloatMenu>
                </Show>
            </div>
        </button>
    );
};
