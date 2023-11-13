import { JSXElement, createContext } from 'solid-js'
import { Atom, atom } from '@cn-ui/reactive'
import { WallPaper } from './WallPaper'
import { SystemMenuList, SystemMenuBar } from './SystemMenuList'

export const SystemContext = createContext<{
    wallpaper?: Atom<{
        url: string
    }>
    menuList: Atom<SystemMenuList>
}>()

export const System = (props: { children: JSXElement }) => {
    return <SystemContext.Provider value={{
        menuList: atom<SystemMenuList>({
            name: "KonghaYao",
            list: []
        })
    }}>
        <section class='flex flex-col h-full w-full overflow-hidden'>
            <SystemMenuBar></SystemMenuBar>
            <section class='flex-1'>
                {props.children}
            </section>
            <WallPaper></WallPaper>
        </section>
    </SystemContext.Provider>
}

