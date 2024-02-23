import axios from "axios";
// import env from "@/utils/validateEnv";
import { LoginData, RecordData, SignupData } from "@/lib";

// type guard funcs
const hasEndpoint = (obj: unknown): obj is Window & { _endpoint: string } =>
  typeof obj === "object" && obj !== null && "_endpoint" in obj;
const isLocalhost = (hostname: string): boolean =>
  hostname === "localhost" || hostname === "127.0.0.1";

const getBaseUrl = () => {
  let host: string;
  let port: number;
  let myBaseURL: string;

  if (hasEndpoint(window)) {
    if (isLocalhost(window._endpoint)) {
      console.log("[API] window._endpoint  ||| ", window._endpoint);
      //localhost일 때
      host = "localhost";
      port = 5000;

      myBaseURL = `http://${host}:${port}`;

      console.log(`[API/1] host : ${host} || baseURL: ${myBaseURL}`);
    }
    //localhost가 아닐 때, 즉 도메인이 있는 배포 서버에서 돌릴 때
    else {
      host = "sangwookim.store";
      myBaseURL = `https://${host}`;

      console.log(`[API/2] host : ${host} || ${myBaseURL}`);
    }
  }
  // 만약 enpoint가 없을 때, 정말 최후의 방어선
  else {
    host = "localhost";
    myBaseURL = `http://localhost:5000`; //final defence code
    console.log(`[API/3] host : ${host} || ${myBaseURL}`);
  }

  const placeholder = host === "localhost" ? "DEV" : "PROD";

  console.info(`[API] Connected to [[[ ${placeholder} ]]] server dynamically`);

  return myBaseURL;
};

// const instance = axios.create({
//   baseURL: getBaseUrl(),
//   headers: { "Content-Type": "application/json" },
// });

// API 요청을 보낼 때마다 baseURL을 설정하는 함수
const sendRequest = async (
  method: string,
  url: string,
  data = {},
  headers = {}
) => {
  const fullUrl = `${getBaseUrl()}/${url}`;

  try {
    const response = await axios({
      method,
      url: fullUrl,
      data,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

/** intercept */

// instance.interceptors.request.use(
//   function (res) {
//     return res;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터 추가하기
// instance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

/** USER */

// login
export const api_login = async (data: LoginData) => {
  const url = "user/login";

  return sendRequest("post", url, data);
};
// signup
export const api_signUp = async (data: SignupData) => {
  const url = "user/register";
  return sendRequest("post", url, data);
};

// get current user for checking: login_required
export const api_getCurrentUser = async () => {
  const url = "user/current";

  const storageData = sessionStorage.getItem("loginState-atom-persist");
  if (storageData) {
    const parsedData = JSON.parse(storageData);
    const token = parsedData.loginState.token;

    return sendRequest(
      "get",
      url,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  }
};

/** RANKING */
export const api_recordRanking = async ({
  winner,
  endtime,
  participants,
}: RecordData) => {
  const url = "rank/register";
  const data = { winner, endtime, participants };
  return sendRequest("post", url, data);
};

export const api_getRanking = async () => {
  const url = "rank/records";
  return sendRequest("get", url);
};
