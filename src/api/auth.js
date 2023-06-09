import request from "@/utils/request";
import {
  API_LOGIN_SERVICE,
  API_FORGOT_PW_SERVICE,
  API_LOGOUT_SERVICE,
  API_USER_PROFILE,
  API_UPDATE_USER_PROFILE,
  API_UPDATE_USER_PASSWORD
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function loginByUsername(authData) {
  var encodedAuthData = btoa(authData.username + ":" + authData.password);

  // const data = authData;
  return await request({
    url: API_LOGIN_SERVICE,
    method: "get",
    headers: {
      // eslint-disable-next-line prettier/prettier
      "Authorization": "Basic " + encodedAuthData,
      "X-Requested-With": "XMLHttpRequest"
    }
  });
}

export async function getUserProfile() {
  return await request({
    url: API_USER_PROFILE,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export async function resetByEmail(postData) {
  return await request({
    url: API_FORGOT_PW_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function logout() {
  return await request({
    url: API_LOGOUT_SERVICE,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export async function updateProfile(postData) {
  return await request({
    url: API_UPDATE_USER_PROFILE,
    method: "put",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function updatePassword(postData) {
  return await request({
    url: API_UPDATE_USER_PASSWORD,
    method: "put",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
