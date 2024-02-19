import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";

import TypoLoader from "@/components/Loading/TypoLoader";
import BgImgContainer from "@/components/ImageLoader/BgImgContainer";
import WindowContainer from "@/components/Window/Window_container";

function App() {
  const [imageNames, setImagePaths] = useState<string[]>([]);
  const [isImgLoading, setIsImgLoading] = useState(true);

  // load background images
  useEffect(() => {
    const loadImages = async () => {
      const imageModules = import.meta.glob("./assets/bgImgs/*.webp", {
        eager: false, //not import as module
      });

      const imports = Object.values(imageModules).map((importFn) => importFn());
      const modules = await Promise.all(imports);

      const paths = modules.map((mod: any) => mod.default);

      setImagePaths(paths);
      setIsImgLoading(false);
    };

    loadImages();
  }, []);

  return (
    <>
      {isImgLoading && <TypoLoader />}
      <BgImgContainer imageNames={imageNames} />
      <div id="root-container">
        <WindowContainer>
          <Outlet />
        </WindowContainer>
      </div>
    </>
  );
}

export default App;
