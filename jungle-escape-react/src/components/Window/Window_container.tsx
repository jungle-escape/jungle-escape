import { ComponentProps } from "@/lib";
import "./window.css";

const WindowContainer = ({ children }: ComponentProps) => {
  return (
    <>
      <div className="window">
        <div className="window-title-bar">
          <h1 className="window-title">Jungle Escape</h1>
        </div>
        <div className="window-body">{children}</div>
      </div>
    </>
  );
};

export default WindowContainer;
