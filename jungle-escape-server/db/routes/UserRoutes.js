import { Router } from "express";
import userAuthService from "../services/userService.js";
import { login_required } from "../middlewares/login_requires.js";

const userAuthRouter = Router();

// create: post
userAuthRouter.post("/user/register", async function (req, res, next) {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요."
      );
    }

    // get data from req
    const id = req.body.id;
    const password = req.body.password;
    const nickname = req.body.nickname;

    // create user by using DB utils
    // set userId as '', it should be setted in userService.
    const newUserInput = {
      userId: "",
      id: id,
      password: password,
      nickname: nickname,
    };

    const newUser = await userAuthService.addUser(newUserInput);

    if (newUser.errormsg) {
      throw new Error(newUser.errormsg);
    }

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// login
userAuthRouter.post("/user/login", async function (req, res, next) {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요."
      );
    }
    // get data from req
    const id = req.body.id;
    const password = req.body.password;

    const data = {
      userId: "",
      id: id,
      password: password,
    };

    const user = await userAuthService.getUser(data);

    if (user.errorMsg) {
      throw new Error(user.errorMsg);
    }

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

userAuthRouter.get(
  "/user/current",
  login_required,
  async function (req, res, next) {
    console.log("/user/current 들어왔어요");
    try {
      const user_id = req.currentUserId;
      if (user_id == undefined) {
        throw new Error("request header doesn't have currentUserId");
      }
      const currentUserInfo = await userAuthService.getUserInfo(user_id);

      console.log("currentUserInfo", currentUserInfo);

      if (typeof currentUserInfo == "string") {
        throw new Error(currentUserInfo);
      }
      res.status(250).json(currentUserInfo);
    } catch (err) {
      next(err);
    }
  }
);

userAuthRouter.get("/user/checkNow", async function (req, res, next) {
  try {
    const currentUserInfo = "db connected";

    res.status(250).json(currentUserInfo);
  } catch (err) {
    next(err);
  }
});

// update user info
export { userAuthRouter };
