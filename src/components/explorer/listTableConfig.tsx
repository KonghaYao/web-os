import { TableFieldFormat } from "../../basic/TableFieldFormat";
import { getIconForFile, getIconForFolder } from "vscode-icons-js";
import { ColumnsDefine } from "@visactor/vtable";

export const listTableConfig: ColumnsDefine = [
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
        fieldFormat(record: {
            name: string;
            isFile: boolean;
            isDirectory: boolean;
        }) {
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
