/** SOUND FUNCTION FOR UI */

const default_sound = new URL("../../assets/mouse-click.mp3", import.meta.url)
  .href; //click

const click_sound = new URL("../../assets/mouse-click.mp3", import.meta.url)
  .href;

export const playGlobalUISounds = (
  type: number | string,
  isGameStart: boolean
) => {
  let sound_src = default_sound;
  let audio = null;

  switch (type) {
    case "click":
      sound_src = click_sound;
      audio = new Audio(sound_src);
      audio.volume = 0.8;
      audio.playbackRate = 1.5;
      break;
  }

  if (isGameStart) return; //
  else if (audio) audio.play();
};
