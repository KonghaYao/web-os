import { JSXElement, createContext } from "solid-js";
import { Atom, atom } from "@cn-ui/reactive";
import { WallPaper } from "./WallPaper";
import { SystemMenuList, SystemMenuBar } from "./Menu/SystemMenuList";
import { Emitter } from "mitt";
import { Dock } from "./Dock";

interface FocusingWindow {
    menuList: SystemMenuList;
    event: Emitter<any> | null;
}

export const SystemContext = createContext<{
    wallpaper?: Atom<{
        url: string;
    }>;

    focusingWindow: Atom<FocusingWindow>;
}>();

export const System = (props: { children: JSXElement }) => {
    return (
        <SystemContext.Provider
            value={{
                focusingWindow: atom<FocusingWindow>({
                    menuList: {
                        name: "KonghaYao",
                        list: [],
                    },
                    event: null,
                }),
            }}>
            <section class="flex flex-col h-full w-full overflow-hidden">
                <SystemMenuBar></SystemMenuBar>
                <section class="flex-1">{props.children}</section>
                <WallPaper></WallPaper>
                <Dock></Dock>
            </section>
        </SystemContext.Provider>
    );
};
