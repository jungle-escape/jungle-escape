import "./Loading3d.css";

const Loader3d = () => {
  const dots = Array.from({ length: 12 });

  return (
    <div id="loader-container">
      <div>
        <main id="loader-box">
          <div className="pl">
            {dots.map((_, index) => (
              <div key={index} className="pl__dot"></div>
            ))}
            <div className="pl__text">Loading…</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Loader3d;
