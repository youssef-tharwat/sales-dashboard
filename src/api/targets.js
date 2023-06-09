import request from "@/utils/request";
import {
  GET_TARGET_COUNTRY_BY_YEAR_SERVICE,
  ADD_TARGET_COUNTRY_BY_YEAR_SERVICE,
  GET_TARGET_PROMOTER_BY_YEAR_SERVICE,
  ADD_TARGET_PROMOTER_BY_YEAR_SERVICE,
  ADD_TARGET_COUNTRY_BY_WEEK_SERVICE,
  ADD_TARGET_PROMOTER_BY_WEEK_SERVICE,
  GET_TARGET_COUNTRY_BY_WEEK_SERVICE,
  GET_TARGET_PROMOTER_BY_WEEK_SERVICE,
  GET_TARGET_PROMOTER_LEADER_BY_WEEK_SERVICE,
  ADD_TARGET_PROMOTER_LEADER_BY_WEEK_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getCountryDataList(postData) {
  let year = new Date().getFullYear();
  let type = null;
  let quarter = null;
  let url = "";
  // console.log(postData);
  if (postData.year) {
    year = postData.year;
  }

  if (postData.type) {
    type = postData.type;
  }

  if (postData.quarter > 0 && postData.quarter < 5) {
    quarter = "Q" + postData.quarter;
  }

  if (postData.monthly) {
    url = GET_TARGET_COUNTRY_BY_YEAR_SERVICE + year + "/" + type;
  }

  if (postData.weekly) {
    url = GET_TARGET_COUNTRY_BY_WEEK_SERVICE + year + "/" + quarter + "/" + type;
  }

  return await request({
    url: url,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function uploadTragetCountryData(postData) {
  if (postData.type === "monthly") {
    return await request({
      url: ADD_TARGET_COUNTRY_BY_YEAR_SERVICE,
      method: "post",
      data: postData.data,
      timeout: DEFAULT_TIMEOUT
    });
  } else if (postData.type === "weekly") {
    return await request({
      url: ADD_TARGET_COUNTRY_BY_WEEK_SERVICE,
      method: "put",
      data: postData.data,
      timeout: DEFAULT_TIMEOUT
    });
  } else {
    return false;
  }
}

export async function getPromoterDataList(postData) {
  let year = new Date().getFullYear();
  let type = null;
  let quarter = null;
  let url = "";

  if (postData.year) {
    year = postData.year;
  }

  if (postData.type) {
    type = postData.type;
  }

  if (postData.quarter > 0 && postData.quarter < 5) {
    quarter = "Q" + postData.quarter;
  }

  if (postData.monthly) {
    url = GET_TARGET_PROMOTER_BY_YEAR_SERVICE + year + "/" + type;
  }

  if (postData.weekly) {
    url = GET_TARGET_PROMOTER_BY_WEEK_SERVICE + year + "/" + quarter + "/" + type;
  }

  return await request({
    url: url,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function uploadTragetPromoterData(postData) {
  if (postData.type === "monthly") {
    return await request({
      url: ADD_TARGET_PROMOTER_BY_YEAR_SERVICE,
      method: "post",
      data: postData.data,
      timeout: DEFAULT_TIMEOUT
    });
  } else if (postData.type === "weekly") {
    return await request({
      url: ADD_TARGET_PROMOTER_BY_WEEK_SERVICE,
      method: "put",
      data: postData.data,
      timeout: DEFAULT_TIMEOUT
    });
  } else {
    return false;
  }
}

export async function getPromoterLeaderDataList(postData) {
  let year = new Date().getFullYear();
  let type = null;
  let quarter = null;
  let url = "";

  if (postData.year) {
    year = postData.year;
  }

  if (postData.type) {
    type = postData.type;
  }

  if (postData.quarter > 0 && postData.quarter < 5) {
    quarter = "Q" + postData.quarter;
  }

  if (postData.weekly) {
    url = GET_TARGET_PROMOTER_LEADER_BY_WEEK_SERVICE + year + "/" + quarter + "/" + type;
  }

  return await request({
    url: url,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function uploadTragetPromoterLeaderData(postData) {
  if (postData.type === "monthly") {
    // eslint-disable-next-line
  } else if (postData.type === "weekly") {
    return await request({
      url: ADD_TARGET_PROMOTER_LEADER_BY_WEEK_SERVICE,
      method: "put",
      data: postData.data,
      timeout: DEFAULT_TIMEOUT
    });
  } else {
    return false;
  }
}
