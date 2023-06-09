import request from "@/utils/request";
import { API_SINGLE_USER } from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getUserInfo() {
  return await request({
    url: API_SINGLE_USER,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export async function requestChangePassword(pwData) {
  return await request({
    url: "/api/users/2",
    method: "post",
    pwData,
    timeout: DEFAULT_TIMEOUT
  });
}
