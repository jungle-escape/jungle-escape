import { Schema, model } from "mongoose";

/** schema for Ranking */
const gameRecordSchema = new Schema(
  {
    winner: { type: String, required: true },
    endtime: { type: String, required: true },
    participants: { type: Array },
  },
  {
    timestamps: true,
  }
);

const GameRecordModel = model("GameRecord", gameRecordSchema);
export default GameRecordModel;
