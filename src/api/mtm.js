import request from "@/utils/request";
import {
  GET_EXCLUSIVE_MTM_SERVICE,
  UPLOAD_EXCLUSIVE_MTM_SERVICE,
  UPDATE_EXCLUSIVE_MTM_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getExclusiveMTM(postData) {
  return await request({
    url: GET_EXCLUSIVE_MTM_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function updateExclusiceMTM(postData) {
  let url = UPLOAD_EXCLUSIVE_MTM_SERVICE;
  let method = "post";

  if (postData.id) {
    //Update
    url = UPDATE_EXCLUSIVE_MTM_SERVICE;
    method = "put";
  }

  return await request({
    url: url,
    method: method,
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
