import {
    ListTable,
    ListTableConstructorOptions,
    themes,
} from "@visactor/vtable";

import { createEffect, createMemo, mergeProps, on } from "solid-js";
export const SolidListTable = (
    props: ListTableConstructorOptions & { style: string }
) => {
    let tableInstance: ListTable;
    const p = mergeProps(props, {
        hover: {
            highlightMode: "row",
        },
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

        defaultRowHeight: 24,
        defaultHeaderRowHeight: 32,
        defaultColWidth: 100,
    } as ListTableConstructorOptions);
    const pp = createMemo(() => ({ ...p }));
    createEffect(
        on(pp, () => {
            tableInstance?.updateOption(pp());
        })
    );

    return (
        <div
            style={pp().style}
            ref={(container) => {
                tableInstance = new ListTable(container, pp());
            }}></div>
    );
};
