/* eslint-disable react-refresh/only-export-components */
import { Route } from "@/lib";

import LoginPage from "@/pages/LoginPage";
import SignUppage from "@/pages/SignUpPage";
import GameLobby from "@/pages/GameLobby/GameLobby";
import LandingPage from "@/pages/Landing/LandingPage";

const ROUTES: Route[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  { path: "signUp", element: <SignUppage /> },
  { path: "game", element: <GameLobby /> },
];

export default ROUTES;
