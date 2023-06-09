import request from "@/utils/request";
import {
  UPLOAD_BULK_SALE_SERVICE,
  GET_BULK_SALES_SERVICE,
  GET_UNKNOWN_SERIAL_LIST_SERVICE,
  GET_SALES_DATA_SERVICE,
  DOWNLOAD_BULK_SALES_SERVICE,
  UPDATE_SALES_DATA_SERVICE,
  DOWNLOAD_SALES_DATA_SERVICE,
  CHECK_SERIAL_NUMBER_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getBulkSaleList(postData) {
  return await request({
    url: GET_BULK_SALES_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function uploadBulkSale(postData) {
  let url = UPLOAD_BULK_SALE_SERVICE;
  return await request({
    url: url,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getUnknownSerialList(postData) {
  return await request({
    url: GET_UNKNOWN_SERIAL_LIST_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getSalesData(postData) {
  return await request({
    url: GET_SALES_DATA_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function updateSalesData(postData) {
  return await request({
    url: UPDATE_SALES_DATA_SERVICE,
    method: "put",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function downloadBulkSaleById(postData) {
  return await request({
    url: DOWNLOAD_BULK_SALES_SERVICE + postData.id,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function downloadSalesData(postData) {
  return await request({
    url: DOWNLOAD_SALES_DATA_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function checkSerialNumber(postData) {
  let serial = null;

  if (postData.serial) {
    serial = postData.serial;
  }

  return await request({
    url: CHECK_SERIAL_NUMBER_SERVICE + serial,
    method: "get",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
