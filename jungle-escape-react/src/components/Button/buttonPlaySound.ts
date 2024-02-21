/** SOUND FUNCTION FOR BUTTONS */

const default_sound = new URL(
  "../../assets/button_click_3.mp3",
  import.meta.url
).href;

const type_1_sound = new URL("../../assets/button_click_1.mp3", import.meta.url)
  .href;

const type_3_sound = new URL("../../assets/button_click_3.mp3", import.meta.url)
  .href;

const make_room = new URL("../../assets/button_makeRoom.mp3", import.meta.url)
  .href;
const alert_open = new URL("../../assets/alert_modal_open.mp3", import.meta.url)
  .href;

export const buttonClickSound = (type: number | string) => {
  let sound_src = default_sound;
  if (type === 1) sound_src = type_1_sound;
  if (type === 3) sound_src = type_3_sound;
  if (type === "make_room") sound_src = make_room;
  if (type === "alert_open") sound_src = alert_open;

  const audio = new Audio(sound_src);
  audio.play();
};
