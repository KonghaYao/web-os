import { VModel, atom, reflect, usePaginationStack } from "@cn-ui/reactive";
import { trpc } from "../../api";
import { SolidListTable } from "../../basic/ListTable";
export const Explorer = () => {
    const pwd = atom("");
    /** 用户输入的属性 */
    const pathString = reflect(() => pwd());
    const folder = usePaginationStack((page, maxPage) => {
        return trpc.file.listDir.query({ page, dir: pwd() }).then((res) => {
            maxPage(Math.ceil(res.count / 10));
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
                columns={[
                    { field: "name", title: "名称", width: 200, sort: true },
                    {
                        field: "birthtime",
                        title: "创建日期",
                        width: 200,
                        sort: true,
                    },
                ]}></SolidListTable>
            {folder.currentPage() < folder.maxPage() && (
                <div onclick={() => folder.next()}>加载更多</div>
            )}
            {folder.currentPage() === folder.maxPage() && <div>没有更多了</div>}
        </section>
    );
};
