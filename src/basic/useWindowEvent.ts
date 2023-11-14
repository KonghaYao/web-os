import { onCleanup, useContext } from "solid-js";
import { WindowContext } from "./Window";
import { GetActionFromMenuList } from "../components/explorer/MenuList";
import { SystemMenuList } from "../components/system/Menu/SystemMenuList";

export const useWindowEvent = <K extends SystemMenuList>(
    action: GetActionFromMenuList<K>,
    cb: () => void
) => {
    const window = useContext(WindowContext)!;
    window.event.on(action as string, cb);
    onCleanup(() => window.event.off(action as string, cb));
};
