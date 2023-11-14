import { SystemMenuList } from "../system/Menu/SystemMenuList";

export const MenuList = {
    name: "Explorer",
    list: [
        {
            label: "file",
            actions: [
                {
                    key: "key",
                    label: "test",
                },
                {
                    label: "New Finder Window",
                    actions: [
                        {
                            key: "create-new",
                            label: "maxContext",
                        },
                    ],
                },
                {
                    label: "New Finder Window",
                    actions: [
                        {
                            key: "create-new2",
                            label: "maxContext",
                        },
                    ],
                },
            ],
        },
    ],
} as const satisfies SystemMenuList;

type AC = { key?: string; actions?: AC }[];
type GetAction<T extends AC> = {
    [K in keyof T]: T[K] extends { actions: AC }
        ? GetAction<T[K]["actions"]>
        : T[K]["key"];
}[number];
export type GetActionFromMenuList<T extends SystemMenuList> = GetAction<
    T["list"]
>;
