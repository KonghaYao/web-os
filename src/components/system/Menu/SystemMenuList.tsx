import { SiApple } from "solid-icons/si";
import { Icon } from "../../../basic/Icon";
import { For, useContext } from "solid-js";
import { SystemContext } from "../";
import { MenuButton } from "./MenuButton";
interface SystemMenuActionBase {
    label: string;
    disabled?: boolean;
}
export interface SystemMenuAction extends SystemMenuActionBase {
    /** window 组件的触发事件名称 */
    key: string;
}
export interface SystemMenuFloatBtn extends SystemMenuActionBase {
    actions: SystemMenuItemConfig[];
}
export type SystemMenuItemConfig = SystemMenuAction | SystemMenuFloatBtn;
export interface SystemMenuList {
    /** APP 名称 */
    name: string;
    list: SystemMenuItemConfig[];
}
export const SystemMenuBar = () => {
    const system = useContext(SystemContext)!;
    return (
        <header class="h-8 flex-none w-full flex px-4  backdrop-blur-sm bg-gray-50/20 text-sm items-center select-none">
            <div class="flex gap-4">
                <Icon>{SiApple}</Icon>
                <span class="font-bold px-2">{system.menuList().name}</span>
            </div>
            <For each={system.menuList().list}>
                {(item) => {
                    return <MenuButton {...item}></MenuButton>;
                }}
            </For>
            <div class="flex-1"></div>

            <div></div>
        </header>
    );
};
