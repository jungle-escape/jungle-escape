import { Schema, model } from "mongoose";

/** schema for Ranking, based on Room   */
const gameRecordSchema = new Schema(
  {
    roomId_num: { type: Schema.Types.ObjectId, ref: "Room" },
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        elapsedTime: Number, // 참가자의 게임 경과 시간
      },
    ],
    completedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const GameRecord = model("GameRecord", gameRecordSchema);
export default GameRecord;
