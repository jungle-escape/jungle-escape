import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { gameState } from "@/recoil/gameState";

import "./App.css";

import TypoLoader from "@/components/Loading/TypoLoader";
import BgImgContainer from "@/components/ImageLoader/BgImgContainer";
import WindowContainer from "@/components/Window/Window_container";
import MusicBox from "@/components/BGM/BackgroundMusic";
//import BgCanvas from "@/components/Background_3d/BgCanvas";

import { playGlobalUISounds } from "@/components/BGM/uiPlaySound";

function App() {
  const [imageNames, setImagePaths] = useState<string[]>([]);
  const [isImgLoading, setIsImgLoading] = useState(true);

  const gameData = useRecoilValue(gameState);

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

  useEffect(() => {
    const handleGlobalClick = () => {
      playGlobalUISounds("click", gameData.isGameStart);
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [gameData.isGameStart]);

  return (
    <>
      {isImgLoading && <TypoLoader />}
      <BgImgContainer imageNames={imageNames} />
      <MusicBox />
      {/* <BgCanvas /> */}
      <div id="root-container">
        <WindowContainer>
          <Outlet />
        </WindowContainer>
      </div>
    </>
  );
}

export default App;
