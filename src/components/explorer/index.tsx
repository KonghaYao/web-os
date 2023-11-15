import { atom, reflect, usePaginationStack } from "@cn-ui/reactive";
import { trpc } from "../../api";
import { SolidListTable } from "../../basic/ListTable";
import {
    RegisterWindow,
    Window,
    defineWindowComponent,
} from "../../basic/Window";
import {
    RiArrowsArrowLeftSLine,
    RiArrowsArrowRightSLine,
} from "solid-icons/ri";
import { useHistoryTravel } from "solidjs-use";
import { ButtonIcon } from "../../basic/Icon";
import { listTableConfig } from "./listTableConfig";
import { MenuList } from "./MenuList";
import { useWindowEvent } from "../../basic/useWindowEvent";

export const Explorer = defineWindowComponent(
    {
        name: "explorer",
        menuList: MenuList,
    },
    () => {
        const pwd = atom("");
        const history = useHistoryTravel([pwd, pwd]);
        const maxCount = atom(0);
        const folder = usePaginationStack((page, maxPage) => {
            console.log(pwd());
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
        useWindowEvent<typeof MenuList>("create-new2", () => {
            console.log("3232");
        });
        return (
            <>
                <RegisterWindow name="headerSlot">
                    <div class="flex-1 flex gap-2 p-4">
                        <ButtonIcon
                            onclick={() => {
                                const backPath = pwd().replace(
                                    /^(.*\/)[^\/]+\/?$/,
                                    "$1"
                                );
                                if (backPath) {
                                    pwd(backPath);
                                    folder.resetStack();
                                }
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
                            {pwd().replace(/^.*\/([^\/]+)\/?$/, "$1")}
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
                            (args.scrollRatioY >= 0.8 ||
                                isNaN(args.scrollRatioY))
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
            </>
        );
    }
);
