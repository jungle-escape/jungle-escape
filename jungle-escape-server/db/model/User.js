/** handling CRUD for each models */
import UserModel from "../../db/schemas/User.js";

class User {
  // create
  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  // serach by id(userId)
  static async findByUserId(id) {
    const user = UserModel.findOne({ userId: id });
    return user;
  }

  static async findByUserNickName(nickName) {
    const user = UserModel.findOne({ nickname: nickName });
    return user;
  }

  // serach by id, made by user.
  static async findByUserMadeId({ id }) {
    let targetUser;
    if (id) {
      targetUser = await UserModel.findOne({ id: id });
    }
    return targetUser;
  }

  static async findAll() {
    const users = await UserModel.find({});
    return users;
  }

  static async Update({ id, fieldToUpdate, newValue }) {
    //setting
    const filter = { userId: id };
    const update = { [fieldToUpdate]: newValue };
    const option = { returnOriginal: false };

    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedUser;
  }
}

export default User;
