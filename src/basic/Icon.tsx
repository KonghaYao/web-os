import { Dynamic } from "solid-js/web";
import { IconProps } from "solid-icons";
import { Component } from "solid-js";
export const ButtonIcon = (props: { children: Component<IconProps> }) => {
    return (
        <i class="flex justify-center items-center cursor-pointer aspect-square border rounded-md hover:border-gray-400 hover:bg-gray-200/50 transition-colors">
            <Dynamic
                component={props.children}
                {...{
                    size: 16,
                }}></Dynamic>
        </i>
    );
};
