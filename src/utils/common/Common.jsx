import axios from "axios";
import moment from "moment";
import "moment/locale/ko";
moment.locale("ko");

export const MARSTOCK_DOMAIN = "http://localhost:8111";
export const SOCKET_URL = "ws://localhost:8111/ws/marstock";
// export const SOCKET_CHAT_URL = "ws://localhost:8111/ws/chat";
export const API_KEY = "a42a4db55c114cff5770a883fc8607f9";
export const REDIRECT_URL = "http://localhost:3000/kakao";
export const SECRET_KEY = "Xs7FwH1FUNOkspaOszcuw2wZXTQGrEIs";

// 공통 함수 영역
export const Common = {
  // accessToken
  setAccessToken: (accessToken) => {
    return window.localStorage.setItem("accessToken", accessToken);
  },
  getAccessToken: () => {
    return window.localStorage.getItem("accessToken");
  },

  handleUnauthorized: async () => {
    console.log("handleUnauthorized 실행");
    const accessToken = Common.getAccessToken();
    const config = {
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const refreshToken = await axios.get(
        `${MARSTOCK_DOMAIN}/member/getRefresh?accessToken=${accessToken}`
      );

      const res = await axios.post(
        `${MARSTOCK_DOMAIN}/member/refresh`,
        refreshToken,
        config
      );
      console.log("401 핸들러 엑세스 토큰 : ", res.data);
      if (res.data) {
        window.localStorage.setItem("accessToken", res.data);
        // res.data(토큰값)을 가져와야 로컬스토리지에 넣을수 있음
        return res.data;
      } else {
        window.localStorage.clear();
        throw new Error("리프레쉬 토큰이 만료 되었습니다.");
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};

//인터 셉터
export const Interceptor = axios.create({
  baseURL: MARSTOCK_DOMAIN,
});

Interceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await Common.handleUnauthorized();
      console.log("인터 셉터의 새로운 토큰", newAccessToken);
      // newAccessToken이 false를 반환하는지 확인 후 "/"로 이동
      if (newAccessToken) {
        // localStorage.setItem("accessToken", newAccessToken);
        Interceptor.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        return Interceptor(originalRequest);
      } else {
        // 리프레시 토큰이 만료되었을 경우
        // 로컬 스토리지 제거
        console.log("리프레쉬 토큰 만료");
        window.localStorage.clear();
        //   window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
