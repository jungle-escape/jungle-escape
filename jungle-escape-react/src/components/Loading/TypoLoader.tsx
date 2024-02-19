import "./typoLoader.css";
const TypoLoader = () => {
  const text = "JUNGLE-ESCAPE";

  const letters = text.split("").map((letter, index) => (
    <span key={index} style={{ "--i": index + 1 } as React.CSSProperties}>
      {letter}
    </span>
  ));

  return (
    <div className="waviy-container">
      <div className="waviy">{letters}</div>
    </div>
  );
};

export default TypoLoader;
