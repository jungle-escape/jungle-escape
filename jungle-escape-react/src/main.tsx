import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ROUTES from "@/routes/Routes.tsx";

import App from "@/App";
import TypoLoader from "@/components/Loading/TypoLoader";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";

import ResultPage from "@/pages/ResultPage";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: ROUTES,
  },
  {
    path: "/loadingPage",
    element: <TypoLoader />,
    errorElement: <ErrorPage />,
  },
  { path: "result", element: <ResultPage />, errorElement: <ErrorPage /> },
  { path: "error", element: <ErrorPage />, errorElement: <ErrorPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    {/* <Suspense fallback={<TypoLoader />}> */}
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
    {/* </Suspense> */}
  </>
);
