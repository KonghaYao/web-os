import { VModel, atom, reflect, usePaginationStack } from "@cn-ui/reactive";
import { trpc } from "../../api";
import { SolidListTable } from "../../basic/ListTable";
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
        <section>
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
            <SolidListTable
                style="height:300px;width:300px"
                widthMode="standard"
                dragHeaderMode="column"
                select={{
                    disableSelect: false,
                    headerSelectMode: "inline",
                }}
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
                    { field: "name", title: "名称", width: 200, sort: true },
                    {
                        field: "birthtime",
                        title: "创建日期",
                        width: 200,
                        sort: true,
                    },
                ]}></SolidListTable>
            <div title="缓存加载比例">
                {folder.dataSlices().reduce((col, cur) => col + cur.length, 0)}/
                {maxCount()}
            </div>
        </section>
    );
};
