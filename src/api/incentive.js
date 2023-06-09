import request from "@/utils/request";
import {
  API_INCENTIVE_NORMAL_LIST_SERVICE,
  API_INCENTIVE_NORMAL_LIST_ADD_SERVICE,
  API_INCENTIVE_NORMAL_LIST_UPDATE_SERVICE,
  API_INCENTIVE_NORMAL_GET_BY_ID,
  API_INCENTIVE_NORMAL_ALL_SERVICE,
  API_INCENTIVE_BONUS_UTILITY_GET_SERVICE,
  API_INCENTIVE_BONUS_LIST_SERVICE,
  API_INCENTIVE_BONUS_ADD,
  API_GENERATE_INCENTIVE_PAYABLE_SERVIVE,
  API_INCENTIVE_BONUS_UPDATE,
  API_INCENTIVE_BONUS_GET_BY_ID,
  API_INCENTIVE_TARGET_ADD,
  API_INCENTIVE_TARGET_UPDATE,
  API_INCENTIVE_TARGET_GET_BY_ID,
  API_INCENTIVE_TARGET_LIST_SERVICE,
  API_INCENTIVE_TARGET_UTILITY_GET_SERVICE,
  API_INCENTIVE_NORMAL_GET_ALL_MTM,
  API_GET_PAYOUT_BY_YEAR_SERVICE,
  API_INCENTIVE_PROMOTER_LIST_SERVICE,
  API_INCENTIVE_PROMOTER_ADD,
  API_INCENTIVE_PROMOTER_UPDATE,
  API_INCENTIVE_PROMOTER_GET_BY_ID,
  API_INCENTIVE_PROMOTER_PRODUCT_FAMILY
} from "../constants/services";

import { DEFAULT_TIMEOUT, NO_TIMEOUT } from "../constants/index";

export function getIncentiveNormalList(postData) {
  let countryId = null;

  if (postData.countryId) {
    countryId = postData.countryId;
  }
  return request({
    url: API_INCENTIVE_NORMAL_LIST_SERVICE + countryId,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function addIncentiveNormalList(postData) {
  let url = API_INCENTIVE_NORMAL_LIST_ADD_SERVICE;
  let data = {
    countryId: postData.countryId,
    name: postData.name,
    startDate: postData.startDate,
    endDate: postData.endDate,
    dealerOutletsId: postData.dealerOutletsId,
    excelBase64: postData.excelBase64
  };

  return request({
    url: url,
    method: "post",
    data: data,
    timeout: NO_TIMEOUT
  });
}

export function updateIncentiveNormalList(postData) {
  let url = API_INCENTIVE_NORMAL_LIST_UPDATE_SERVICE;
  let data = {
    id: postData.id,
    name: postData.name,
    startDate: postData.startDate,
    endDate: postData.endDate,
    dealerOutletsId: postData.dealerOutletsId,
    excelBase64: postData.excelBase64
  };

  return request({
    url: url,
    method: "post",
    data: data,
    timeout: NO_TIMEOUT
  });
}

export function getIncentiveNormalById(postData) {
  return request({
    url: API_INCENTIVE_NORMAL_GET_BY_ID + postData,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function getAllNormalIncentivesByCountry(postData) {
  let userData = JSON.parse(localStorage.getItem("user"));
  let countryId = 0;
  if (userData) {
    countryId = userData.user.createdCountryId;
  }

  return request({
    url: API_INCENTIVE_NORMAL_ALL_SERVICE + countryId,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getAllIncentiveNormalMtm() {
  let url = API_INCENTIVE_NORMAL_GET_ALL_MTM;

  return request({
    url: url,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function getBonusIncentiveById(postData) {
  return request({
    url: API_INCENTIVE_BONUS_GET_BY_ID + postData,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function getBonusIncentiveList(postData) {
  let countryId = null;

  if (postData.countryId) {
    countryId = postData.countryId;
  }

  return request({
    url: API_INCENTIVE_BONUS_LIST_SERVICE + countryId,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getBonusIncentiveUtility() {
  return request({
    url: API_INCENTIVE_BONUS_UTILITY_GET_SERVICE,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function addBonusIncentive(postData) {
  let url = API_INCENTIVE_BONUS_ADD;
  let data = {
    startDate: postData.startDate,
    endDate: postData.endDate,
    countryId: postData.countryId,
    name: postData.name,
    roleId: postData.roleId,
    dealerOutletsId: postData.dealerOutletsId,
    type: postData.type,
    recurring: postData.recurring,
    tierList: postData.tierList
  };
  return request({
    url: url,
    method: "post",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getGeneratedIncentivePayableFile(postData) {
  return request({
    url: API_GENERATE_INCENTIVE_PAYABLE_SERVIVE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function updateBonusIncentive(postData) {
  let url = API_INCENTIVE_BONUS_UPDATE;
  let data = {
    id: postData.id,
    startDate: postData.startDate,
    endDate: postData.endDate,
    countryId: postData.countryId,
    name: postData.name,
    roleId: postData.roleId,
    dealerOutletsId: postData.dealerOutletsId,
    type: postData.type,
    recurring: postData.recurring,
    tierList: postData.tierList
  };
  return request({
    url: url,
    method: "put",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getTargetIncentiveById(postData) {
  return request({
    url: API_INCENTIVE_TARGET_GET_BY_ID + postData.id,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function getTargetIncentiveList(postData) {
  let countryId = null;

  if (postData.countryId) {
    countryId = postData.countryId;
  }

  return request({
    url: API_INCENTIVE_TARGET_LIST_SERVICE + countryId,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function addTargetIncentive(postData) {
  let url = API_INCENTIVE_TARGET_ADD;
  let data = {
    startDate: postData.startDate,
    endDate: postData.endDate,
    countryId: postData.countryId,
    name: postData.name,
    roleId: postData.roleId,
    outlets: postData.outlets,
    dealerId: postData.dealerId,
    type: postData.type,
    recurring: postData.recurring,
    tierList: postData.tierList
  };
  return request({
    url: url,
    method: "post",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export function updateTargetIncentive(postData) {
  let url = API_INCENTIVE_TARGET_UPDATE;
  let data = {
    id: postData.id,
    startDate: postData.startDate,
    endDate: postData.endDate,
    countryId: postData.countryId,
    name: postData.name,
    roleId: postData.roleId,
    dealerId: postData.dealerId,
    outlets: postData.outlets,
    type: postData.type,
    recurring: postData.recurring,
    tierList: postData.tierList
  };
  return request({
    url: url,
    method: "put",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getTargetIncentiveUtility() {
  return request({
    url: API_INCENTIVE_TARGET_UTILITY_GET_SERVICE,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function getPayoutListByYear(postData) {
  return request({
    url: API_GET_PAYOUT_BY_YEAR_SERVICE + postData.year,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function getPromoterIncentiveList() {
  return request({
    url: API_INCENTIVE_PROMOTER_LIST_SERVICE,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function addPromoterIncentive(postData) {
  let url = API_INCENTIVE_PROMOTER_ADD;
  let data = {
    startMonth: postData.startMonth,
    startYear: postData.startYear,
    endMonth: postData.endMonth,
    endYear: postData.endYear,
    name: postData.name,
    tierList: postData.tierList,
    objective2List: postData.objective2List
  };
  return request({
    url: url,
    method: "post",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export function updatePromoterIncentive(postData) {
  let url = API_INCENTIVE_PROMOTER_UPDATE;
  let data = {
    id: postData.id,
    startMonth: postData.startMonth,
    startYear: postData.startYear,
    endMonth: postData.endMonth,
    endYear: postData.endYear,
    name: postData.name,
    tierList: postData.tierList,
    objective2List: postData.objective2List
  };
  return request({
    url: url,
    method: "put",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getPromoterIncentiveById(postData) {
  return request({
    url: API_INCENTIVE_PROMOTER_GET_BY_ID + postData,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function getPromoterIncentiveProductFamilyList() {
  return request({
    url: API_INCENTIVE_PROMOTER_PRODUCT_FAMILY,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}
