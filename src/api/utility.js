import request from "@/utils/request";
import {
  GET_BANK_LIST_SERVICE,
  GET_CATEGORY_LIST_SERVICE,
  GET_STATE_LIST_SERVICE,
  GET_COUNTRY_LIST_SERVICE,
  GET_GENDER_LIST_SERVICE,
  GET_NEWS_TARGETS_SERVICE,
  GET_PRODUCT_TYPES_SERVICE,
  GET_PRODUCT_GROUPS_SERVICE,
  GET_SALE_STATUS_SERVICE,
  GET_SERIAL_TYPE_SERVICE,
  GET_CHECK_STATUS_SERVICE,
  GET_FAILE_REASONS_SERVICE,
  GET_INCENTIVE_TARGET_TYPES_SERVICE,
  GET_TARGET_SALES_TYPES_SERVICE,
  GET_COUNTRIES_WITH_REGION_SERVICE,
  GET_PROMOTER_TYPES_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getBankList(postData) {
  return await request({
    url: GET_BANK_LIST_SERVICE + postData.countryCode,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getCategoryList(postData) {
  return await request({
    url: GET_CATEGORY_LIST_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getStateList(postData) {
  // let userData = JSON.parse(localStorage.getItem('user'));
  // let countryId = 0;
  // if (userData) {
  //     countryId = userData.user.createdCountryId;
  // }
  return await request({
    url: GET_STATE_LIST_SERVICE + postData.countryId,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getCountryList(postData) {
  let url = GET_COUNTRY_LIST_SERVICE;
  if (postData.withRegion) {
    url = GET_COUNTRIES_WITH_REGION_SERVICE;

    if (postData.countryId > 0) {
      url = url + "/" + postData.countryId;
    }
  } else {
    url = GET_COUNTRY_LIST_SERVICE;
  }


  return await request({
    url: url,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getGenderList(postData) {
  return await request({
    url: GET_GENDER_LIST_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getNewsTargetList(postData) {
  return await request({
    url: GET_NEWS_TARGETS_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getProductTypeList(postData) {
  return await request({
    url: GET_PRODUCT_TYPES_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getProductGroupList(postData) {
  return await request({
    url: GET_PRODUCT_GROUPS_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getSalesStatusList(postData) {
  return request({
    url: GET_SALE_STATUS_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getSerialTypeList(postData) {
  return await request({
    url: GET_SERIAL_TYPE_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getCheckStatusList(postData) {
  return await request({
    url: GET_CHECK_STATUS_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getFailedReasonList(postData) {
  return await request({
    url: GET_FAILE_REASONS_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getIncentiveTargetTypeList(postData) {
  return await request({
    url: GET_INCENTIVE_TARGET_TYPES_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getTargetSaleTypeList(postData) {
  return await request({
    url: GET_TARGET_SALES_TYPES_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getPromoterTypeList(postData) {
  return await request({
    url: GET_PROMOTER_TYPES_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
