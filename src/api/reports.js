import request from "@/utils/request";
import {
  DOWNLOAD_PROMOTER_ATTENDANCE_SERVICE,
  DOWNLOAD_INCENTIVE_PAYABLE_SERVICE,
  DOWNLOAD_NORMAL_INC_ENT_SERVICE,
  DOWNLOAD_TARGET_INC_ENT_SERVICE,
  DOWNLOAD_BONUS_INC_ENT_SERVICE,
  DOWNLOAD_DEALER_INC_ENT_SERVICE
} from "../constants/services";

import { NO_TIMEOUT } from "../constants/index";

export async function downloadPromoterAttendance(postData) {
  return await request({
    url: DOWNLOAD_PROMOTER_ATTENDANCE_SERVICE,
    method: "post",
    data: postData,
    timeout: NO_TIMEOUT
  });
}

export async function downloadIncentivePayableFile(postData) {
  return await request({
    url: DOWNLOAD_INCENTIVE_PAYABLE_SERVICE,
    method: "post",
    data: postData,
    timeout: NO_TIMEOUT
  });
}

export async function downloadNormalIncentiveEntitlement(postData) {
  return await request({
    url: DOWNLOAD_NORMAL_INC_ENT_SERVICE,
    method: "post",
    data: postData,
    timeout: NO_TIMEOUT
  });
}

export async function downloadBonusIncentiveEntitlement(postData) {
  return await request({
    url: DOWNLOAD_BONUS_INC_ENT_SERVICE,
    method: "post",
    data: postData,
    timeout: NO_TIMEOUT
  });
}

export async function downloadTargetIncentiveEntitlement(postData) {
  return await request({
    url: DOWNLOAD_TARGET_INC_ENT_SERVICE,
    method: "post",
    data: postData,
    timeout: NO_TIMEOUT
  });
}

export async function downloadDealerIncentiveEntitlement(postData) {
  return await request({
    url: DOWNLOAD_DEALER_INC_ENT_SERVICE,
    method: "post",
    data: postData,
    timeout: NO_TIMEOUT
  });
}
