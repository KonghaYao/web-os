import { SiApple } from 'solid-icons/si'
import { Icon } from '../../basic/Icon'
import { JSXElement, createContext } from 'solid-js'
import { Atom } from '@cn-ui/reactive'
import { WallPaper } from './WallPaper'

export const SystemContext = createContext<{
    wallpaper?: Atom<{
        url: string
    }>
}>()

export const System = (props: { children: JSXElement }) => {
    return <SystemContext.Provider value={{}}>
        <section class='flex flex-col h-full w-full overflow-hidden'>
            <SystemStatusBar></SystemStatusBar>
            <section class='flex-1'>
                {props.children}
            </section>
            <WallPaper></WallPaper>
        </section>
    </SystemContext.Provider>
}
export const SystemStatusBar = () => {
    return <header class='h-8 flex-none w-full flex px-4 py-2 backdrop-blur-sm bg-gray-50/20'>
        <div>
            <Icon>{SiApple}</Icon>

        </div>

        <div class='flex-1'>

        </div>

        <div>

        </div>
    </header>
}