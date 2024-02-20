import WindowContainer from "@/components/Window/Window_container";
import "./ringLoader.css";
const RingLoader = () => {
  return (
    <WindowContainer className={"window-ranking"}>
      <div style={{ backgroundColor: "black" }}>
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </WindowContainer>
  );
};

export default RingLoader;
