import request from "@/utils/request";
import {
  API_DEALER_LIST_SERVICE,
  API_SINGLE_DEALER_SERVICE,
  ADD_DEALER_SERVICE,
  UPDATE_DEAER_SERVICE,
  SUBMIT_DEALER_INCENTIVE_SERVICE,
  API_DEALERS_OUTLETS_LIST_SERVICE,
  API_ALL_DEALER_LIST_SERVICE,
  API_DEALER_SELL_IN_LIST_SERVICE,
  API_DEALER_SELL_IN_ADD_SERVICE,
  API_DEALER_SELL_OUT_ADD_SERVICE,
  API_DEALER_SELL_OUT_LIST_SERVICE,
  API_DEALER_STOCK_LIST_SERVICE,
  API_DEALER_STOCK_LIST_MONTHLY_SERVICE,
  API_DEALER_STOCK_LIST_DOWNLOAD_SERVICE,
  API_DEALER_INC_ENT_LIST_SERVICE,
  API_DEALER_INC_RECEIPT_LIST_SERVICE,
  API_DEALER_INC_ENT_UPLOAD_BY_DEALER_SERVICE,
  API_DEALER_INC_ENT_UPLOAD_BY_MONTH_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getDealerList(postData) {
  let countryId = postData.countryId ? "/" + postData.countryId : "";

  let url = API_DEALER_LIST_SERVICE;
  if (postData.type === "all") {
    url = API_ALL_DEALER_LIST_SERVICE + countryId;
  } else {
    url = API_DEALER_LIST_SERVICE + countryId;
  }
  return await request({
    url: url,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealerById(postData) {
  return await request({
    url: API_SINGLE_DEALER_SERVICE + postData.id,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addOrUpdateDealer(postData) {
  // let userData = JSON.parse(localStorage.getItem('user'));
  // let countryId = 0;
  // if (userData) {
  //     countryId = userData.user.createdCountryId;
  // }

  // let countryId = this.$store.getters.getCountryId;

  let url = ADD_DEALER_SERVICE;
  let data = {};
  // alert(postData.countryId);
  if (postData.change_status) {
    data = {
      status: postData.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE",
      dealerName: postData.dealerName
    };
    // alert(JSON.stringify(data));
  } else {
    data = {
      // status: postData.status == "ACTIVE" ? "DEACTIVATED" : "ACTIVE",
      businessRegNo: postData.businessRegNo,
      dealerName: postData.dealerName,
      ownerName: postData.ownerName,
      ownerIcOrId: postData.ownerIcOrId,
      contactNum: postData.contactNum,
      email: postData.email,
      accountManager: postData.accountManager,
      bulkUpload: postData.bulkUpload ? true : false,
      prmLppName: postData.prmLppName,
      bankAccNam: postData.bankAccNam,
      storeId: postData.storeId,
      bankAccNum: postData.bankAccNum,
      countryId: postData.countryId,
      bankId: postData.bankId ? postData.bankId.id : null
    };
  }

  if ((!postData.dealerId || !postData.id) && !postData.change_status) {
    data.status = "ACTIVE";
  }

  //   if (!postData.dealerId) {
  //     data.status = "ACTIVE";
  //   } else {
  //     data = {
  //       businessRegNo: postData.businessRegNo,
  //       dealerName: postData.dealerName,
  //       ownerName: postData.ownerName,
  //       ownerIcOrId: postData.ownerIcOrId,
  //       contactNum: postData.contactNum,
  //       email: postData.email,
  //       accountManager: postData.accountManager,
  //       bulkUpload: postData.bulkUpload,
  //       prmLppName: postData.prmLppName,
  //       storeId: postData.storeId,
  //       bankAccNam: postData.bankAccNam,
  //       bankAccNum: postData.bankAccNum,
  //       bankId: postData.bankId,
  //       countryId: postData.countryId
  //     };

  //     if (!postData.id) {
  //       data.status = "ACTIVE";
  //     } else {
  //       data.status = postData.status;
  //     }
  //   }
  // }

  if (postData.dealerId || postData.id) {
    data.id = postData.dealerId ? postData.dealerId : postData.id;

    url = UPDATE_DEAER_SERVICE;
  }

  return await request({
    url: url,
    method: "put",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function submitDealerIncentiveList(postData) {
  return await request({
    url: SUBMIT_DEALER_INCENTIVE_SERVICE,
    method: "put",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealersOutletsList() {
  return await request({
    url: API_DEALERS_OUTLETS_LIST_SERVICE,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealerSellInList(postData) {
  return await request({
    url: API_DEALER_SELL_IN_LIST_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addDealerSellIn(postData) {
  return await request({
    url: API_DEALER_SELL_IN_ADD_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealerSellOutList(postData) {
  return await request({
    url: API_DEALER_SELL_OUT_LIST_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addDealerSellOut(postData) {
  return await request({
    url: API_DEALER_SELL_OUT_ADD_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealerStockList(postData) {
  return await request({
    url: API_DEALER_STOCK_LIST_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealerStockMonthlyList(postData) {
  return await request({
    url: API_DEALER_STOCK_LIST_MONTHLY_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function downloadDealerStock(postData) {
  return await request({
    url: API_DEALER_STOCK_LIST_DOWNLOAD_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealerIncentiveList() {
  return await request({
    url: API_DEALER_INC_ENT_LIST_SERVICE,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealerUploadList(postData) {
  return await request({
    url: API_DEALER_INC_RECEIPT_LIST_SERVICE + postData.year,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export async function uploadByDealer(postData) {
  return await request({
    url: API_DEALER_INC_ENT_UPLOAD_BY_DEALER_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function uploadByYearMonth(postData) {
  return await request({
    url: API_DEALER_INC_ENT_UPLOAD_BY_MONTH_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
