// for router
export interface Route {
  path: string;
  element: JSX.Element;
  errorElement?: JSX.Element;
}

export interface BtnProps {
  onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
  btnContent: string;
}

export interface ComponentProps {
  children: JSX.Element;
}
// for blocker modal

export interface BtnTextProps {
  btnContent: string;
}

export interface ModalProp {
  modalContent: string;
  onClickHandler: () => void;
}

export interface GameCloseModalProp {
  modalContent: string;
  handleBlockerProceed: () => void;
  handleBlockerReset: () => void;
}
