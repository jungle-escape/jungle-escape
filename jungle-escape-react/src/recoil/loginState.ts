import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const sessionStorage =
  typeof window !== "undefined" ? window.sessionStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "loginState-atom-persist",
  storage: sessionStorage,
});

export const loginState = atom({
  key: "loginState",
  default: {
    isLoggedIn: false,
    token: "",
  },
  effects_UNSTABLE: [persistAtom],
});
