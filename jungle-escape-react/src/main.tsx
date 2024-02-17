import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";

import ROUTES from "@/routes/Routes.tsx";

import App from "@/App";
import TypoLoader from "@/components/Loading/TypoLoader";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Suspense fallback={<TypoLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  </>
);
