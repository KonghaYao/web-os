import dayjs from "dayjs";
import { TYPES } from "@visactor/vtable";
import prettyBytes, { Options as ByteOptions } from "pretty-bytes";
export class TableFieldFormat {
    static Time(key: string, format = "YYYY-MM-DD HH:mm"): TYPES.FieldFormat {
        return (record) => {
            return dayjs(record[key]).format(format);
        };
    }
    static ByteSize(key: string, options?: ByteOptions): TYPES.FieldFormat {
        return (record) => {
            return prettyBytes(record[key], options);
        };
    }
}
