import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from "./types";
import { USER_SERVER } from "../component/Config";

export function loginUser(dataTosubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataTosubmit, {
      //서버쪽에서 보내는 쿠키를 클라이언트쪽에서 저장시키는 코드.
      withCredentials: true,
    })
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit, {
      withCredentials: true,
    })
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(`${USER_SERVER}/auth`, {
      withCredentials: true,
    })
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios
    .post(
      `${USER_SERVER}/logout`,
      {},
      {
        withCredentials: true,
      }
    )
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}
