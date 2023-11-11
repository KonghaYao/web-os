import { VModel, atom, reflect, usePaginationStack } from "@cn-ui/reactive";
import { trpc } from "../../api";

export const Explorer = () => {
  const pwd = atom("");
  /** 用户输入的属性 */
  const pathString = reflect(() => pwd());
  const folder = usePaginationStack((page, maxPage) => {
    console.log(pwd());
    return trpc.file.listDir.query({ page, dir: pwd() }).then((res) => {
      maxPage(Math.ceil(res.count / 10));
      pwd(res.dir);
      return res.list;
    });
  }, {});

  return (
    <div>
      <input type="text" {...VModel(pathString, { valueName: "input" })} />
      <button
        onclick={() => {
          pwd(pathString);
          folder.refetch();
        }}
      >
        跳转
      </button>
      <ul>
        {folder.currentData()?.map((i) => {
          return <li>{i.name}</li>;
        })}
      </ul>
      {folder.currentPage() <= folder.maxPage() && (
        <div onclick={() => folder.next()}>加载更多</div>
      )}
    </div>
  );
};
