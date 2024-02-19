/// <reference types="playcanvas" />

interface JoinRoomResponse {
  status: "success" | "full";
  message?: string;
}

declare class NetworkEntities {
  private _index: Map<any, any>;
  constructor();
  get(id: any): any;
  has(id: any): boolean;
  add(networkEntity: any): void;
}

declare class User extends pc.EventHandler {
  id: any;
  mine: boolean;
  constructor(id: any, mine: boolean);
  send(
    name: string,
    data: any,
    callback?: (err?: Error, data?: any) => void
  ): void;
  destroy(): void;
}

declare class Room extends pc.EventHandler {
  id: any;
  tickrate: number;
  users: Map<any, User>;
  networkEntities: NetworkEntities;
  private _hierarchyHandler: any;
  root: any;
  latency: number;
  constructor(id: any, tickrate: number, users: any);
  send(
    name: string,
    data: any,
    callback?: (err?: Error, data?: any) => void
  ): void;
  destroy(): void;
  // Add other methods here
}

declare class Levels {
  constructor();
  save(sceneId: any, callback: (level: any) => void): void;
  build(room: Room, level: any): Promise<void>;
  // Add other methods and properties here
}

declare class InterpolateValue {
  private INTERPOLATION_STATES_LIMIT: number;
  private type: any;
  private pool: any[];
  private states: any[];
  private current: number;
  private time: number;
  private speed: number;
  private tickrate: number;
  private from: any;
  private value: any;
  private object: any;
  private key: any;
  private setter: any;
  constructor(value: any, object: any, key: any, setter: any, tickrate: number);
  set(value: any): void;
  add(value: any): void;
  update(dt: number): void;
  // Add other methods and properties here
}

declare class PlayNetwork extends pc.EventHandler {
  private _lastId: number;
  private _callbacks: Map<any, any>;
  me: User | null;
  room: Room | null;
  latency: number;
  bandwidthIn: number;
  bandwidthOut: number;
  levels: Levels;
  isSocketOpened: boolean;
  constructor();
  initialize(): void;
  connect(
    host: string,
    port: string,
    useSSL: boolean,
    payload: any,
    callback?: (err?: Error, data?: any) => void
  ): void;
  createRoom(data: any, callback?: (err?: Error, roomId?: any) => void): void;
  joinRoom(
    id: any,
    callback?: (err?: Error) => void
  ): Promise<JoinRoomResponse | null>;
  leaveRoom(): Promise<void>;
  send(
    name: string,
    data: any,
    callback?: (err?: Error, data?: any) => void
  ): void;
  // Add other methods and properties here
}

// // Extend window interface to include PlayNetwork instance
// interface Window {
//   pn: PlayNetwork;
// }
declare let pn: PlayNetwork;
declare let LOG: any;
declare let ENDLOG: any;
declare let STARTLOG: any;
declare let ELAPSEDTIME: any;
declare let WINNER: any;
declare let PROGRESSBAR: any;
declare let BAR: any;
declare let RANK: any;
declare let HELLOWORLD: any;
