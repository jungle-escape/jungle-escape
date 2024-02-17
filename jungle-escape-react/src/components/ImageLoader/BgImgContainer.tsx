import { useEffect, useState } from "react";
import "./bgImgContainer.css";
/** customized hook */
const useLoadImagePaths = () => {
  const [imageNames, setImagePaths] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const imageModules = import.meta.glob("../../assets/bgImgs/*.webp", {
        eager: false, //not import as module
      });

      const imports = Object.values(imageModules).map((importFn) => importFn());
      const modules = await Promise.all(imports);

      const paths = modules.map((mod: any) => mod.default);
      setImagePaths(paths);
    };

    loadImages();
  }, []);

  return imageNames;
};

/** Container for background-slider */
const BgImgContainer = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagePaths = useLoadImagePaths();

  console.log("이미지 슬라이더: ", imagePaths);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [imagePaths.length]);

  return (
    <div className="background-slider">
      <div className="light-effect"></div>
      <div className="overlay-slider">
        {imagePaths.map((path, index) => (
          <img
            key={index}
            src={path}
            alt={`Slideshow ${index}`}
            className={`slide ${index === currentImageIndex ? "active" : ""}`}
            style={{
              opacity: index === currentImageIndex ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BgImgContainer;
