import { SystemMenuList } from "../system/Menu/SystemMenuList";

export const MenuList: SystemMenuList = {
    name: "Terminal",
    list: [
        {
            label: "file",
            actions: [
                {
                    label: "New Finder Window",
                    actions: [{ label: "maxContext" }],
                },
                {
                    label: "New Finder Window",
                    actions: [{ label: "maxContext" }],
                },
            ],
        },
    ],
};
