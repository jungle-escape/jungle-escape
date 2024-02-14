import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "@/App";
import ErrorPage from "@/pages/ErrorPage";
import ROUTES from "@/routes/Routes.tsx";
////

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: ROUTES,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    {/* <App /> */}
    <RouterProvider router={router} />
  </>
);
