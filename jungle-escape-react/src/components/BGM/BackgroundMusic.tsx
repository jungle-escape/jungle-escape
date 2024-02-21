// import { ComponentProps } from "@/lib";
import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useRecoilState } from "recoil";
import { musicState } from "@/recoil/musicState";

import "./music.css";
const MusicBox = () => {
  const [musicData, setMusicData] = useRecoilState(musicState);
  const musicRef = useRef<HTMLAudioElement>(null);

  /** check page url  */
  const location = useLocation();

  /** Music Url */
  const musicUrl =
    location.pathname === "/result"
      ? new URL("../../assets/bgm-result.mp3", import.meta.url).href
      : new URL("../../assets/bgm-basic.mp3", import.meta.url).href;

  //check play state from recoil
  useEffect(() => {
    const playMusic = async () => {
      if (musicData.isPlay && musicRef.current) {
        try {
          await musicRef.current.play();
        } catch (error) {
          setMusicData({ ...musicData, isPlay: false }); //music off
          console.error("자동 재생 실패: 사용자 상호작용이 필요합니다.", error);
        }
      } else if (musicRef.current) {
        musicRef.current.pause();
      }
    };

    playMusic();
  }, [musicData.isPlay]);

  /** for UI */
  const toggleAudio = () => {
    if (musicData.isPlay) {
      musicRef.current?.pause();
      setMusicData({ ...musicData, isPlay: false }); //music off
    } else {
      musicRef.current?.play();
      setMusicData({ ...musicData, isPlay: true }); //music on
    }
  };

  return (
    <>
      <audio ref={musicRef} loop src={musicUrl} preload="auto" />
      <div className="music-box">
        <section className="music-ui-container">
          <div className="music-ui-box">
            <div className="playpause">
              <input
                type="checkbox"
                value="None"
                id="playpause"
                name="check"
                checked={musicData.isPlay}
                onChange={toggleAudio}
              />
              <label htmlFor="playpause" tabIndex={1}></label>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MusicBox;
