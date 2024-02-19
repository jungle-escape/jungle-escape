import {
  Link,
  useLocation,
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
// import BasicBtn from "@/components/Button/BasicButton";
import "./errorPage.css";
import "@/components/Button/button.css";

const ErrorPage = () => {
  const error = useRouteError();
  const currentLoc = useLocation();
  const history = useNavigate();

  console.log("[Error] : ", error);

  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error("[Error/UnKnown] :", error);
    errorMessage = "Unknown error";
  }
  return (
    <>
      <main className="window-error">
        <div className="window-error-box">
          <div className="error-box ">
            <div className="error-cli">
              <p>
                <span className="error-date">ubuntu@ip-20-24-02-24 :</span>
                <span> pintos -- run jungle-escape</span>
                <br />
                Boot Complete
                <br />
                FAIL jungle-escaple
                <br />
                Kernel panic in run : PANIC at jungle-escape.site
                {currentLoc.pathname}
              </p>

              <p>Call stack: {errorMessage}</p>
            </div>
          </div>
          <div className="two-btn-container">
            <Link className="button-type-3" to={`/`}>
              메인으로
            </Link>
            <button onClick={() => history(-1)} className="button-type-3">
              뒤로가기
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ErrorPage;
