import { ComponentProps } from "@/lib";
import "./window.css";

const WindowContainer = ({
  children,
  className,
}: ComponentProps & { className?: string }) => {
  const containerClassName = className || "window";
  return (
    <>
      <div className={containerClassName}>
        {/* <div className="window-title-bar">
          <h1 className="window-title">Jungle Escape</h1>
        </div> */}
        {/* <div className="window-body">{children}</div> */}
        {children}
      </div>
    </>
  );
};

export default WindowContainer;
