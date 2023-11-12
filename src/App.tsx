import { WebTerminal } from "./components/terminal/Terminal.tsx";
import { Explorer } from "./components/explorer/index.tsx";
import "./tailwind.css";
import "./global.css";
function App() {
    return (
        <>
            {/* <WebTerminal></WebTerminal> */}
            <Explorer></Explorer>
        </>
    );
}
export default App;
