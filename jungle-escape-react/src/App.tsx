import WindowContainer from "@/components/Window/Window_container";
import "./App.css";
import { Outlet } from "react-router-dom";

import BgImgContainer from "@/components/ImageLoader/BgImgContainer";

function App() {
  return (
    <>
      <BgImgContainer></BgImgContainer>
      <div id="root-container">
        <WindowContainer>
          <Outlet />
        </WindowContainer>
      </div>
    </>
  );
}

export default App;
