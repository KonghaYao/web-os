import { SiApple } from 'solid-icons/si';
import { Icon } from '../../basic/Icon';
import { For, Show, createContext, useContext } from 'solid-js';
import { SystemContext } from '.';
import { Atom, atom } from '@cn-ui/reactive';
import { onClickOutside, useElementHover } from 'solidjs-use';
interface SystemMenuAction {
    label: string;
    disabled?: boolean;
    actions?: SystemMenuAction[];
}
export interface SystemMenuList {
    /** APP 名称 */
    name: string;
    list: SystemMenuAction[];
}
export const SystemMenuBar = () => {
    const system = useContext(SystemContext)!;

    return <header class='h-8 flex-none w-full flex px-4 py-1 backdrop-blur-sm bg-gray-50/20 text-sm items-center select-none'>
        <div class='flex gap-4'>
            <Icon>{SiApple}</Icon>
            <span class='font-bold'>
                {system.menuList().name}
            </span>
            <For each={system.menuList().list}>
                {(item, index) => {
                    return <MenuButton {...item}>

                    </MenuButton>
                }}
            </For>

        </div>

        <div class='flex-1'>

        </div>

        <div>

        </div>
    </header>;
};

const MenuButtonContext = createContext<{ show: Atom<boolean> }>()
export const MenuButton = (props: SystemMenuAction) => {
    const show = atom(false)
    const target = atom<HTMLDivElement | null>(null)
    onClickOutside(target, () => show(false))
    return <MenuButtonContext.Provider value={{ show }}>
        <button class='relative' onclick={() => show(true)}>
            {props.label}
            <div ref={(e) => target(e)} >
                <Show when={show()}>
                    <FloatMenu {...props}></FloatMenu>
                </Show>
            </div>
        </button>
    </MenuButtonContext.Provider>
}
export const FloatMenu = (props: SystemMenuAction) => {
    const listClass = 'flex flex-col gap-2 rounded  w-[12rem] backdrop-blur-sm bg-gray-50/60 z-10 '
    return <div class={listClass + 'absolute top-[110%] left-0'}>
        {props.actions?.map(i => {
            const el = atom<HTMLDivElement | null>(null)
            const isHovered = useElementHover(el, { delayLeave: 1000 })

            return <button ref={el} class='relative'>
                {i.label}
                <Show when={isHovered()}>
                    <div class={listClass + 'absolute top-0 left-[110%]'}>
                        {i.actions?.map(ii => {
                            return <button>{ii.label}</button>
                        })}
                    </div>
                </Show>

            </button>
        })}
    </div>
}