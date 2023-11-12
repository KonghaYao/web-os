import { Context } from "solid-js";

export type ValueOf<T> = T[keyof T];
export type GetContextInner<C> = NonNullable<
    C extends Context<infer R> ? R : unknown
>;
