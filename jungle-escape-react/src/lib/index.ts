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

export interface ImageNames {
  imageNames: string[];
}
/* TYPES for button */

export interface BtnProps {
  onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
  btnContent: string;
}

export interface BtnTextProps {
  btnContent: string;
}

export interface BasicUILinkProps {
  to: string;
  btnContent: string;
  style?: React.CSSProperties;
  soundType?: number;
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
  nickname?: string;
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

/** TYPES for Ranking */
export interface RecordData {
  winner: string;
  endtime: string;
  participants: Array<string>;
}

export interface WinnerData {
  rankingList: Array<string>;
  endtime: string;
  topRender?: boolean;
}

// RankingData는 result 또는 records 중 하나를 반드시 포함해야 하지만 둘 다 가질 수는 없는 구조
export type RankingData =
  | { result: WinnerData; records?: never } // records는 없고 result만 있음
  | { result?: never; records: RecordData[] }; // result는 없고 records만 있음

export interface WinnerDataFromServer {
  winner: string;
  endtime: string;
}
