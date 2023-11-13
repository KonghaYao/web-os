import { useContext } from "solid-js";
import { atomization } from "@cn-ui/reactive";
import { SystemContext } from ".";

export const WallPaper = () => {
    const system = useContext(SystemContext)!;
    const wallpaper = atomization(
        system.wallpaper ?? {
            url: "https://macos-web.app/assets/ventura-2.62166e05.webp",
        }
    );
    return (
        <div class="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
            <img
                class="min-h-[100%] min-w-[100%]"
                src={wallpaper().url}
                alt=""
            />
        </div>
    );
};
