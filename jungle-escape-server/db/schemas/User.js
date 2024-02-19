import { Schema, model } from "mongoose";

/** schema for User collection  */
const UserSchema = new Schema({
  // customized primary key, should be unique
  userId: {
    type: String,
    required: true,
  },
  //user's id, should be unique
  id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  participatedRooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
});

const UserModel = model("User", UserSchema);
export default UserModel;

/**
 * for save 
 * 
 * email: {
    type: String,
    required: true,
    match: [
      /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "형식에 맞는 이메일을 적어주세요.",
    ],
  },
 */
