import request from "@/utils/request";
import { API_GET_MOBILE_APP_SETTINGS, API_UPDATE_MOBILE_APP_SETTINGS } from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function updateMobileAppSettings(postData) {
  return await request({
    url: API_UPDATE_MOBILE_APP_SETTINGS,
    method: "put",
    data: [postData],
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getMobileSettings(postData) {
  let countryId = null;

  if (postData.countryId) {
    countryId = postData.countryId;
  }
  return await request({
    url: API_GET_MOBILE_APP_SETTINGS + countryId,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
