import { Dynamic } from "solid-js/web";
import { IconProps } from "solid-icons";
import { Component } from "solid-js";
export const Icon = (props: {
    children: Component<IconProps>;
    onclick?: () => void;
}) => {
    return (
        <i
            class="flex justify-center items-center cursor-pointer rounded-md"
            onclick={props.onclick}>
            <Dynamic
                component={props.children}
                {...{
                    size: 16,
                }}></Dynamic>
        </i>
    );
};
export const ButtonIcon = (props: {
    children: Component<IconProps>;
    onclick?: () => void;
}) => {
    return (
        <i
            class="flex justify-center items-center cursor-pointer aspect-square border rounded-md hover:border-gray-400 hover:bg-gray-200/50 transition-colors"
            onclick={props.onclick}>
            <Dynamic
                component={props.children}
                {...{
                    size: 16,
                }}></Dynamic>
        </i>
    );
};
