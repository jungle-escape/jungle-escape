import WindowContainer from "@/components/Window/Window_container";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div id="root-container">
      <WindowContainer>
        <Outlet />
      </WindowContainer>
    </div>
  );
}

export default App;
