import "dotenv/config";
import User from "../model/User.js";
import bcyrpt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

/**
 * user_id / userId : uuid로 만든 unique한 db 구별용 아이디
 * id: 유저가 만든 id
 */
/** Auth service  */

class userAuthService {
  // If id is already exist, return true.
  // It will be checked before ...
  static async checkUserMadeId(input_user_id) {
    const existedUser = await User.findByUserMadeId({ id: input_user_id });
    if (existedUser) {
      return true;
    } else {
      return false;
    }
  }

  static async addUser({ id, password, nickname }) {
    const user = await User.findByUserMadeId({ id: id });
    /**check email again */
    if (user) {
      const errormsg = "아이디 중복 체크를 진행해주세요.";
      return { errormsg };
    }

    //hash password
    const hashedPwd = await bcyrpt.hash(password, 10);

    //make userId by uuid
    const userId = uuidv4();

    // save in db
    const newUser = {
      userId: userId,
      id: id,
      password: hashedPwd,
      nickname: nickname,
    };

    const createdNewUser = await User.create({ newUser });
    createdNewUser.errormsg = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

    return createdNewUser;
  }

  static async getUser({ id, password }) {
    // check email db
    const user = await User.findByUserMadeId({ id });
    if (!user) {
      const errorMsg = "해당 아이디는 가입 내역이 없습니다.";
      return { errorMsg };
    }

    // check password
    const hasehdExistPwd = user.password;
    const isCorrectPwd = bcyrpt.compare(password, hasehdExistPwd);
    if (!isCorrectPwd) {
      const errorMsg = "비밀번호가 일치하지 않습니다. 다시 확인해주세요.";
      return { errorMsg };
    }

    //login success, create JWT web Token

    const secreteKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ user_id: user.userId }, secreteKey);

    //setting loginUser for return

    const userId = user.userId; //uuid로 만든 unique한 userId.
    const nickname = user.nickname;

    const loginUser = {
      token,
      userId,
      nickname,
      errorMsg: null,
    };

    return loginUser;
  }

  //get all users
  static async getUsers() {
    const users = await User.findAll();
    return users;
  }
  //get a user by uuid-id (userId)
  static async getUserByUserId(user_id) {
    const user = await User.findByUserId(user_id);
    return user;
  }

  static async setUser({ user_id, toUpdate }) {
    let user = await User.findByUserId(user_id);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage = "가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    if (toUpdate.nickname) {
      const userId = user_id;
      const fieldToUpdate = "nickname";
      const newValue = toUpdate.nickname;
      user = await User.Update({ userId, fieldToUpdate, newValue });
    }

    //   if (toUpdate.id) {
    //     const userId = user_id;
    //     const fieldToUpdate = "id";
    //     const newValue = toUpdate.id;
    //     user = await User.Update({ userId, fieldToUpdate, newValue });
    //   }

    if (toUpdate.password) {
      const userId = user_id;
      const fieldToUpdate = "password";
      const newValue = await bcyrpt.hash(toUpdate.password, 10);
      user = await User.Update({ userId, fieldToUpdate, newValue });
    }

    return user;
  }

  static async getUserInfo(user_id) {
    const user = await User.findByUserId(user_id);

    if (!user) {
      const errormsg =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errormsg };
    }

    return user;
  }
}

export default userAuthService;
