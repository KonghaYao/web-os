import { atom } from "@cn-ui/reactive";
export const Dock = () => {
    const apps = atom(new Array(10).fill(10));

    return (
        <section class="w-full flex items-center justify-center mb-2">
            <div class="bg-gray-100/60 p-2  rounded-3xl backdrop-blur-sm flex justify-center items-center gap-4">
                {apps().map((i, index) => {
                    return (
                        <div class="dock-icon-item transition-all h-12 w-12 rounded-xl bg-black"></div>
                    );
                })}
            </div>
        </section>
    );
};
