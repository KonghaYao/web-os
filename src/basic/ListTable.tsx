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
import { usePaginationStack } from "@cn-ui/reactive";

type SolidTableEvent = {
    [K in ValueOf<typeof ListTable.EVENT_TYPE>]: TYPES.TableEventListener<K>;
};
export const SolidListTable = (
    props: ListTableConstructorOptions & {
        class: string;
    } & Partial<SolidTableEvent> & {
            paginationStack?: ReturnType<typeof usePaginationStack<any>>;
        }
) => {
    let tableInstance: ListTable;

    const p = mergeProps(props, {
        hover: {
            highlightMode: "row",
        },
        select: {
            disableSelect: false,
            headerSelectMode: "inline",
        },
        dragHeaderMode: "column",
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
            },
            headerStyle: {
                fontSize: 16,
                borderLineWidth: 0,
            },
        }),
        overscrollBehavior: "none",
        defaultRowHeight: 24,
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
                tableInstance = new ListTable(container, options);
                Object.values(ListTable.EVENT_TYPE).forEach((event) => {
                    if (event in options) {
                        /** @ts-ignore */
                        tableInstance.on(event, options[event]);
                    }
                });
            }}></div>
    );
};
