import request from "@/utils/request";
import {
  API_DISTRIBUTOR_LIST_SERVICE,
  API_SINGLE_DISTRIBUTOR_SERVICE,
  ADD_DISTRIBUTOR_SERVICE,
  UPDATE_DISTRIBUTOR_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getDistributorList(postData) {
  return await request({
    url: API_DISTRIBUTOR_LIST_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDistributorById(postData) {
  return await request({
    url: API_SINGLE_DISTRIBUTOR_SERVICE + postData.id,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addOrUpdateDistributor(postData) {
  let url = ADD_DISTRIBUTOR_SERVICE;
  let method = "post";
  let data = {};
  if (postData.change_status) {
    data = {
      status: postData.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE",
      name: postData.name
    };
    method = "post";
  } else {
    data = {
      name: postData.name,
      code: postData.code,
      countryId: postData.countryId
    };
  }

  if ((!postData.distributorId || !postData.id) && !postData.change_status) {
    data.status = "ACTIVE";
  }

  if (postData.distributorId || postData.id) {
    data.id = postData.distributorId ? postData.distributorId : postData.id;

    url = UPDATE_DISTRIBUTOR_SERVICE;
    method = "post";
  }

  return await request({
    url: url,
    method: method,
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}
