import { JSXElement, createContext } from "solid-js";
import { Atom, atom } from "@cn-ui/reactive";
import { WallPaper } from "./WallPaper";
import { SystemMenuList, SystemMenuBar } from "./Menu/SystemMenuList";
import { Emitter } from "mitt";

export const SystemContext = createContext<{
    wallpaper?: Atom<{
        url: string;
    }>;
    menuList: Atom<SystemMenuList>;
    event: Atom<Emitter<any> | null>;
}>();

export const System = (props: { children: JSXElement }) => {
    return (
        <SystemContext.Provider
            value={{
                menuList: atom<SystemMenuList>({
                    name: "KonghaYao",
                    list: [],
                }),
                event: atom<Emitter<any> | null>(null),
            }}>
            <section class="flex flex-col h-full w-full overflow-hidden">
                <SystemMenuBar></SystemMenuBar>
                <section class="flex-1">{props.children}</section>
                <WallPaper></WallPaper>
            </section>
        </SystemContext.Provider>
    );
};
