import { WebTerminal } from "./components/terminal/Terminal.tsx";
import { Explorer } from "./components/explorer/index.tsx";
import "./tailwind.css";
import "./global.css";
import { System } from "./components/system/index.tsx";
function App() {
    return (
        <System>
            {/* <WebTerminal></WebTerminal> */}
            <Explorer></Explorer>
        </System>
    );
}
export default App;
