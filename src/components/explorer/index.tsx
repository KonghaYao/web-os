import { atom, reflect, usePaginationStack } from "@cn-ui/reactive";
import { trpc } from "../../api";
import { SolidListTable } from "../../basic/ListTable";
import { RegisterWindow, Window } from "../../basic/Window";
import { TableFieldFormat } from "../../basic/TableFieldFormat";
import { getIconForFile, getIconForFolder } from "vscode-icons-js";
import {
    RiArrowsArrowLeftSLine,
    RiArrowsArrowRightSLine,
} from "solid-icons/ri";
import { useHistoryTravel } from "solidjs-use";
import { ButtonIcon } from "../../basic/Icon";
import { ColumnsDefine } from "@visactor/vtable";
import { SystemContext } from "../system";
import { SystemMenuList } from '../system/SystemMenuList';
import { useContext } from "solid-js";

const listTableConfig: ColumnsDefine = [
    {
        field: "icon",
        title: "",
        width: "auto",
        cellType: "image",
        dragHeader: false,
        maxWidth: 50,
        minWidth: 50,
        keepAspectRatio: true,
        imageAutoSizing: false,
        fieldFormat(record: { name: string, isFile: boolean, isDirectory: boolean }) {
            if (record.isFile)
                return (
                    "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/" +
                    getIconForFile(record.name)
                );
            if (record.isDirectory)
                return (
                    "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/" +
                    getIconForFolder(record.name)
                );
            return "";
        },
        style: {
            margin: 0,
        },
    },
    { field: "name", title: "名称", width: 200, sort: true },
    {
        field: "birthtime",
        title: "创建时间",
        width: 200,
        fieldFormat: TableFieldFormat.Time("birthtime"),
        sort: true,
    },
    {
        field: "size",
        title: "文件大小",
        width: 100,
        fieldFormat: TableFieldFormat.ByteSize("size"),
        sort: true,
    },
    {
        field: "atime",
        title: "上次打开时间",
        width: 200,
        fieldFormat: TableFieldFormat.Time("atime"),
        sort: true,
    },
    {
        field: "mtime",
        title: "修改时间",
        fieldFormat: TableFieldFormat.Time("mtime"),
        width: 200,
        sort: true,
    },
];

const MenuList: SystemMenuList = {
    name: "explorer",
    list: [{
        label: "file",
        actions: [
            {
                label: "New Finder Window",
                actions: [
                    { label: "maxContext" }
                ]
            }
        ]
    }]
}


export const Explorer = () => {
    const system = useContext(SystemContext)!
    system.menuList(MenuList)
    const pwd = atom("");
    const history = useHistoryTravel([pwd, pwd]);
    const maxCount = atom(0);
    const folder = usePaginationStack((page, maxPage) => {
        return trpc.file.listDir
            .query({ page, dir: pwd(), size: 10 })
            .then((res) => {
                maxPage(Math.ceil(res.count / 10));
                maxCount(res.count);
                pwd(res.dir);

                return res.list;
            });
    }, {});
    const itemList = reflect(() => folder.dataSlices().flat());

    return (
        <Window name="explorer">
            <RegisterWindow name="headerSlot">
                <div class="flex-1 flex gap-2 p-4">
                    <ButtonIcon
                        onclick={() => {
                            pwd((i) => i.replace(/^(.*)\/[^\/]*$/, "$1"));
                            folder.resetStack();
                        }}>
                        {RiArrowsArrowLeftSLine}
                    </ButtonIcon>
                    <ButtonIcon
                        onclick={() => {
                            history.undo();
                            folder.resetStack();
                        }}>
                        {RiArrowsArrowRightSLine}
                    </ButtonIcon>

                    <div class="mx-2">
                        {pwd().replace(/^.*\/([^\/]*)$/, "$1")}
                    </div>
                </div>
            </RegisterWindow>
            <SolidListTable
                cacheKey="app-explorer-list"
                class="flex-1"
                records={itemList()}
                dblclick_cell={(e) => {
                    if (e.originData) {
                        const data: ReturnType<typeof itemList>[0] =
                            e.originData;
                        if (data.isDirectory) {
                            pwd((i) => i + "/" + data.name);
                            history.clear();
                            folder.resetStack();
                        }
                    }
                }}
                scroll={(args) => {
                    if (
                        !folder.currentData.loading() &&
                        typeof args.scrollRatioY === "number" &&
                        (args.scrollRatioY >= 0.8 || isNaN(args.scrollRatioY))
                    ) {
                        // 由于 usePagination 本身设计有 debounce，所以需要快速直接更新状态
                        const index = folder.currentIndex() + 1;
                        if (index < 0 || index >= folder.maxPage()) {
                            return false;
                        } else {
                            folder.currentIndex(index);
                            folder.currentData.refetch();
                        }
                    }
                }}
                columns={listTableConfig}></SolidListTable>
            <footer class="flex gap-4 px-2 text-sm border-t border-gray-100">
                <div>
                    {folder
                        .dataSlices()
                        .reduce((col, cur) => col + cur.length, 0)}
                    /{maxCount()}
                </div>
                <div class=" flex-1">{pwd()}</div>
            </footer>
        </Window>
    );
};
