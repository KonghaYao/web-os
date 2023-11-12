import { VModel, atom, reflect, usePaginationStack } from "@cn-ui/reactive";
import { trpc } from "../../api";
import { SolidListTable } from "../../basic/ListTable";
import { Window } from "../../basic/Window";
import { TableFieldFormat } from "../../basic/TableFieldFormat";
export const Explorer = () => {
    const pwd = atom("");
    const maxCount = atom(0);
    /** 用户输入的属性 */
    const pathString = reflect(() => pwd());
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
            <div>
                <input
                    type="text"
                    {...VModel(pathString, { valueName: "input" })}
                />
                <button
                    onclick={() => {
                        pwd(() => pathString());
                        folder.resetStack();
                    }}>
                    跳转
                </button>
            </div>
            <SolidListTable
                class="flex-1"
                records={folder.dataSlices().flat()}
                dblclick_cell={(e) => {
                    const data: ReturnType<typeof itemList>[0] = e.originData;
                    if (data.isDirectory) {
                        pwd((i) => i + "/" + data.name);
                        folder.resetStack();
                    }
                    console.log();
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
                columns={[
                    { field: "icon", title: "", width: 50 },
                    { field: "name", title: "名称", width: 200, sort: true },
                    {
                        field: "birthtime",
                        title: "创建时间",
                        width: 200,
                        fieldFormat: TableFieldFormat.Time("birthtime"),
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
                    {
                        field: "size",
                        title: "文件大小",
                        width: 100,
                        fieldFormat: TableFieldFormat.ByteSize("size"),
                        sort: true,
                    },
                ]}></SolidListTable>
            <div title="缓存加载比例">
                {folder.dataSlices().reduce((col, cur) => col + cur.length, 0)}/
                {maxCount()}
            </div>
        </Window>
    );
};
