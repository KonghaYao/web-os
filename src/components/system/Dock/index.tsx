import { atom } from "@cn-ui/reactive";
export const Dock = () => {
    const apps = atom(new Array(10).fill(10));

    return (
        <section class="h-24 w-full flex items-center justify-center">
            <div class="bg-gray-100/60 p-3 h-24 rounded-2xl backdrop-blur-sm flex justify-center items-center gap-8">
                {apps().map((i, index) => {
                    return (
                        <div class="dock-icon-item transition-all h-16 w-16 rounded-2xl bg-black"></div>
                    );
                })}
            </div>
        </section>
    );
};
