import { Schema, model } from "mongoose";

/** schema for Room  */
const roomSchema = new Schema({
  roomId_num: { type: Number, required: true }, //redis
  roomId: { type: String, required: false },
  roomName: { type: String, required: false, default: "" },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  gameRecords: [{ type: Schema.Types.ObjectId, ref: "GameRecord" }],
});

const RoomModel = model("Room", roomSchema);
export default RoomModel;
