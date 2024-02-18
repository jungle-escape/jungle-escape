import { useEffect, useState } from "react";
import "./bgImgContainer.css";

/** Container for background-slider */
const BgImgContainer = ({ prop }) => {
  const imageNames = prop;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (imageNames.length === 0) return; // 이미지가 없는 경우는 interval 설정을 스킵

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageNames.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [imageNames.length]);

  return (
    <div className="background-slider">
      <div className="light-effect"></div>
      <div className="overlay-slider">
        {imageNames.map((path, index) => (
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
