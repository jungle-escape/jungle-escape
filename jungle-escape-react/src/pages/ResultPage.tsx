import TypoLoader from "@/components/Loading/TypoLoader";
import Ranking from "@/components/Ranking/EndRanking";
import { useLocation, useNavigate } from "react-router-dom";
import BgImgContainer from "@/components/ImageLoader/BgImgContainer";
import { useEffect, useState } from "react";
//import resultImg1 from "@/assets/bgImgs/02.algo.webp";

const ResultPage = () => {
  const naivate = useNavigate();
  const location = useLocation();
  const currResult = location.state || null;

  const [imageNames, setImagePaths] = useState<string[]>([]);
  const [isImgLoading, setIsImgLoading] = useState(true);

  console.log("[ResultPage] currResult? ", currResult);

  useEffect(() => {
    if (!currResult) {
      // url을 통한 접속, 현재 끝난 랭킹 정보가 없으므로 메인으로 리다이렉트
      naivate("/");
    }

    const loadImages = async () => {
      const imageModules = import.meta.glob("../assets/bgImgs/resImgs/*.webp", {
        eager: false, //not import as module
      });

      const imports = Object.values(imageModules).map((importFn) => importFn());
      const modules = await Promise.all(imports);

      const paths = modules.map((mod: any) => {
        console.log("[mod] typeof mod ", typeof mod);
        return mod.default;
      });

      setImagePaths(paths);
      setIsImgLoading(false);
    };

    loadImages();
  }, []);

  return (
    <>
      {isImgLoading && <TypoLoader />}
      <BgImgContainer imageNames={imageNames} />
      {currResult ? <Ranking data={{ result: currResult }} /> : <TypoLoader />}
    </>
  );
};

export default ResultPage;
