import axios from "axios";
// import env from "@/utils/validateEnv";
import { LoginData, RecordData, SignupData } from "@/lib";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  headers: { "Content-Type": "application/json" },
});

/** intercept */

// 요청 인터셉터 추가하기
instance.interceptors.request.use(
  function (res) {
    // console.log("instance.interceptors.request", res);
    // 요청이 전달되기 전에 작업 수행
    return res;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가하기
instance.interceptors.response.use(
  function (response) {
    // console.log("instance.interceptors.response", response);
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행
    return response;
  },
  function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);

/** USER */

// login
export const api_login = async (data: LoginData) => {
  const body = data;
  const url = "user/login";

  return instance.post(url, body);
};
// signup
export const api_signUp = async (data: SignupData) => {
  const url = "user/register";

  return instance.post(url, data);
};

// get current user for checking: login_required
export const api_getCurrentUser = async () => {
  const url = "user/current";
  const storageData = sessionStorage.getItem("loginState-atom-persist");
  if (storageData) {
    const parsedData = JSON.parse(storageData);
    const token = parsedData.loginState.token;
    //console.log("[API]", token);

    //console.log("parsedData?", parsedData);

    return instance.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  }
};

/** RANKING */
export const api_recordRanking = async ({
  winner,
  endtime,
  participants,
}: RecordData) => {
  const url = "rank/register";
  //console.log(`[api_recordRanking] ${data} 들어왔어요 ${url}`);
  const data = { winner, endtime, participants };
  console.log("[api_recordRanking] data: ", data);
  return instance.post(url, data);
};

export const api_getRanking = async () => {
  const url = "rank/records";
  return instance.get(url);
};

//////// for PRODUCTION ////////
// type guard funcs
//   const hasEndpoint = (obj: unknown): obj is Window & { _endpoint: string } =>
//     typeof obj === "object" && obj !== null && "_endpoint" in obj;

// let host: string;
// if (hasEndpoint(window)) {
//   host = window._endpoint;
// } else {
//   // window._endpoint가 존재하지 않을 때, .env에 세팅해둔 endpoint를 가져온다.
//   host = import.meta.env.VITE_ENDPOINT;
// }

// const placeholder = host === "localhost" ? "DEV" : "PROD";
// const port = placeholder === "DEV" ? "5000" : "";
// console.info(`[API] Connecting to [[[ ${placeholder} ]]] server...`);

// const instance = axios.create({
//   //baseURL: import.meta.env.VITE_API_DOMAIN,
//   baseURL: `http://${host}:${port}`,
//   headers: { "Content-Type": "application/json" },
// });

////////////////////////////////////////////
