import GoBack from "@/components/GoBackButton/GoBack";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

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
      <main>
        <h1>에러 발생!!!</h1>

        <h2>Error!</h2>
        <p>{errorMessage}</p>
        <GoBack />
      </main>
    </>
  );
};

export default ErrorPage;
