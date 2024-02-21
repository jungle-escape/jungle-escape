import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const sessionStorage =
  typeof window !== "undefined" ? window.sessionStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "music-atom-persist",
  storage: sessionStorage,
});

export const musicState = atom({
  key: "musicState",
  default: {
    isPlay: false,
  },
  effects_UNSTABLE: [persistAtom],
});
