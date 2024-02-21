import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const sessionStorage =
  typeof window !== "undefined" ? window.sessionStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "gameState-atom-persist",
  storage: sessionStorage,
});

export const gameState = atom({
  key: "gameState",
  default: {
    isGameStart: false,
  },
  effects_UNSTABLE: [persistAtom],
});
