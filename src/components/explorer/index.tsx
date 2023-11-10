import { atom, resource } from "@cn-ui/reactive"
import { trpc } from "../../api"

export const Explorer = () => {
    const path = atom([])
    const folder = resource(() => {
        return trpc.apt.version.query()
    })
    return <div>
        <div>

        </div>
    </div>
}