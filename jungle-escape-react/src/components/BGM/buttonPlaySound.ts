/** SOUND FUNCTION FOR BUTTONS */

/* sound url */
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

/* handling sound */
export const buttonClickSound = (type: number | string) => {
  let sound_src = default_sound;

  switch (type) {
    case 1:
      sound_src = type_1_sound;
      break;

    case 3:
      sound_src = type_3_sound;
      break;

    case "make_room":
      sound_src = make_room;
      break;

    case "alert_open":
      sound_src = alert_open;
      break;
  }

  const audio = new Audio(sound_src);
  audio.play();
};
