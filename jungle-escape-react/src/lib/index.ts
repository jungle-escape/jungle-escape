// for router
export interface Route {
  path: string;
  element: JSX.Element;
  errorElement?: JSX.Element;
}

export interface ComponentProps {
  children: JSX.Element;
}

export interface SetterProps {
  setter: (arg: boolean) => void;
}
/* TYPES for button */

export interface BtnProps {
  onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
  btnContent: string;
}

export interface BtnTextProps {
  btnContent: string;
}

/** TYPES for Modals */
export interface ModalProp {
  modalContent: string;
  onClickHandler: () => void;
}

export interface GameCloseModalProp {
  modalContent: string;
  handleBlockerProceed: () => void;
  handleBlockerReset: () => void;
  processMsg: string;
  resetMsg: string;
}

/** TYPES for API */
export interface LoginData {
  id: string;
  password: string;
  nickname: string;
}

export interface SignupData extends LoginData {
  nickname: string;
}

export interface UserData {
  id: string;
  //nickname: string;
  nickname: string | null;
  participatedRooms: string[];
}
