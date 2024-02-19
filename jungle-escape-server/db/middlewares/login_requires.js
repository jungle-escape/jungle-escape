import "dotenv/config";
import jwt from "jsonwebtoken";

function login_required(req, res, next) {
  const userToken = req.headers["authorization"]?.split(" ")[1] ?? "null";

  /**
   * This token would e jwt token string or 'null' string,
   * if the token is null, services will be rejected which need the login_required.
   */
  if (userToken === "null") {
    console.log("Req for service, Authorization toekn is null");
    res.status(400).send("로그인한 유저만 사용할 수 있는 서비스입니다.");
    return;
  }

  /** checking valid token or not, get infor from valid token  */
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const user_id = jwtDecoded.user_id;

    req.currentUserId = user_id;
    next();
  } catch (error) {
    res.status(400).send("정상적인 토큰이 아닙니다. 다시 한 번 확인해 주세요.");
    return;
  }
}

export { login_required };
