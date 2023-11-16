import {
    ListTable,
    ListTableConstructorOptions,
    themes,
    TYPES,
    data,
} from "@visactor/vtable";

import {
    createEffect,
    createMemo,
    mergeProps,
    on,
    onCleanup,
    splitProps,
} from "solid-js";
import { ValueOf } from "./type-utils";
import { ArrayAtom, localSync, usePaginationStack } from "@cn-ui/reactive";
import { nextTick } from "solidjs-use";

type SolidTableEvent = {
    [K in ValueOf<typeof ListTable.EVENT_TYPE>]: TYPES.TableEventListener<K>;
};
export const SolidListTable = (
    props: ListTableConstructorOptions & {
        class: string;
        cacheKey: string;
    } & Partial<SolidTableEvent> & {
            paginationStack?: ReturnType<typeof usePaginationStack<any>>;
        }
) => {
    let tableInstance: ListTable;
    const columnCache = useColumnCache(props);
    const p = mergeProps(props, {
        hover: {
            highlightMode: "row",
        },
        select: {
            disableSelect: false,
            headerSelectMode: "inline",
        },
        dragHeaderMode: "all",
        widthMode: "standard",
        theme: themes.SIMPLIFY.extends({
            selectionStyle: {
                cellBorderColor: "transparent",
                cellBorderLineWidth: 0,
                cellBgColor: "transparent",
            },
            bodyStyle: {
                fontSize: 16,
                borderLineWidth: 0,
                bgColor: "transparent",
            },
            defaultStyle: {
                bgColor: "transparent",
            },
            headerStyle: {
                fontSize: 16,
                borderLineWidth: 0,
            },
        }),
        overscrollBehavior: "none",
        defaultRowHeight: 36,
        defaultHeaderRowHeight: 32,
        defaultColWidth: 100,
    } as ListTableConstructorOptions);
    const [records, _p] = splitProps(p, ["records"]);
    const pp = createMemo(() => ({ ..._p }));
    createEffect(
        on(pp, () => {
            tableInstance?.updateOption(pp());
        })
    );
    createEffect(
        on(
            () => records.records,
            (val) => {
                tableInstance.setRecords(val || []);
            }
        )
    );
    onCleanup(() => {
        tableInstance;
    });

    return (
        <div
            class={pp().class}
            ref={(container) => {
                const options = pp();

                const columns = columnCache.getColumnsFromCache(
                    options.columns!
                );
                options.columns = columns;
                tableInstance = new ListTable(container, options);
                columnCache.registerEvent(tableInstance);

                Object.values(ListTable.EVENT_TYPE).forEach((event) => {
                    if (event in options) {
                        /** @ts-ignore */
                        tableInstance.on(event, options[event]);
                    }
                });
            }}></div>
    );
};

/**
 * 使用列缓存
 * @param cacheKey 缓存键
 * @returns 缓存工具对象
 */
const useColumnCache = (props: { cacheKey: string }) => {
    // 创建一个原子变量用于存储列缓存
    const columnsCache = ArrayAtom<{ field: string; width?: number }[]>([]);
    // 对列缓存进行本地同步，使用给定的缓存键作为标识
    localSync(columnsCache, props.cacheKey + "-columns");
    return {
        columnsCache,
        /**
         * 从缓存中获取列定义
         * @param columns 列定义
         * @returns 返回从缓存中获取到的列定义
         */
        getColumnsFromCache(columns: TYPES.ColumnsDefine) {
            // 获取列缓存
            const cache = columnsCache();
            if (cache.length === columns.length) {
                // 将缓存中的列定义映射到实际的列定义数组中，并设置宽度
                return cache.map(({ field, width }) => {
                    // 在列定义数组中找到与缓存中字段匹配的列
                    const col = columns.find((i) => i.field === field)!;
                    // 设置列的宽度，如果缓存中没有宽度则使用默认宽度
                    col.width = width ?? col.width;
                    return col;
                });
            } else {
                // 首次不渲染
                nextTick(() => {
                    // 如果列缓存为空，则将初始列定义存入列缓存中
                    columnsCache(
                        columns.map((i) => ({ field: i.field as string }))
                    );
                });
                return columns;
            }
        },
        /**
         * 注册事件监听器
         * @param tableInstance 列表表实例
         */
        registerEvent(tableInstance: ListTable) {
            // TODO 监听表头位置变化事件
            tableInstance.on(
                ListTable.EVENT_TYPE.CHANGE_HEADER_POSITION,
                (e) => {
                    const old = columnsCache();
                    if (e.source.col !== e.target.col) {
                        columnsCache.move(
                            old[e.source.col],
                            old[e.target.col],
                            "after"
                        );
                        console.log(e.source.col, e.target.col);
                    }

                    return;
                }
            );
            // 监听列调整结束事件，更新列缓存
            tableInstance.on(ListTable.EVENT_TYPE.RESIZE_COLUMN_END, (e) => {
                // 更新列缓存
                columnsCache((cols) => {
                    return cols.map((col, index) => ({
                        ...col,
                        width: e.columns[index],
                    }));
                });
            });
        },
    };
};
