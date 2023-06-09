import request from "@/utils/request";
import {
  API_OUTLET_PIC_LIST_SERVICE,
  API_SINGLE_OUTLET_PIC_SERVICE,
  UPDATE_OUTLET_PIC_SERVICE,
  ADD_OUTLET_PIC_SERVICE,
  API_OUTLET_LIST_SERVICE,
  API_SINGLE_OUTLET_SERVICE,
  UPDATE_OUTLET_SERVICE,
  ADD_OUTLET_SERVICE,
  UPLOAD_BULK_OUTLET_SERVICE,
  API_DEALER_OUTLET_LIST_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getOutletPicList(postData) {
  return await request({
    url: API_OUTLET_PIC_LIST_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getOutletPICById(postData) {
  const data = {
    id: postData.id
  };
  return await request({
    url: API_SINGLE_OUTLET_PIC_SERVICE + data.id,
    method: "get",
    params: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addOrUpdateOutletPic(postData) {
  let url = ADD_OUTLET_PIC_SERVICE;
  let userData = JSON.parse(localStorage.getItem("user"));
  let countryId = 0;
  let ownerAccId = 8;
  if (userData) {
    countryId = userData.user.createdCountryId;
  }
  let data = {};

  if (postData.change_status) {
    data = {
      // dealerId: postData.dealerId.id,
      // picName: postData.picName,
      // email: postData.email,
      // countryId: postData.countryId,
      // ownerAccId: ownerAccId,
      statusType: postData.statusType == "ACTIVE" ? "DEACTIVATED" : "ACTIVE"
    };
    url = UPDATE_OUTLET_PIC_SERVICE;
  } else {
    data = {
      dealerId: postData.dealerId ? postData.dealerId.id : 0,
      picName: postData.picName,
      email: postData.email,
      countryId: countryId,
      ownerAccId: ownerAccId
    };

    if (!postData.id) {
      data.statusType = "ACTIVE";
    }
  }

  if (postData.outletId || postData.id) {
    data.id = postData.outletId ? postData.outletId : postData.id;
    url = UPDATE_OUTLET_PIC_SERVICE;
  }

  return await request({
    url: url,
    method: "put",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getOutletList(postData) {
  return await request({
    url: API_OUTLET_LIST_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getDealerOutletList() {
  return await request({
    url: API_DEALER_OUTLET_LIST_SERVICE,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getOutletById(postData) {
  return await request({
    url: API_SINGLE_OUTLET_SERVICE + postData.id,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addOrUpdateOutlet(postData) {
  let url = ADD_OUTLET_SERVICE;
  let ownerAccId = 8;
  let data = {};

  if (postData.change_status) {
    data = {
      status: postData.status === "DEACTIVATED" ? "ACTIVE" : "DEACTIVATED",
      updatePic: false
    };
    url = UPDATE_OUTLET_SERVICE;
  } else if (postData.change_outlet) {
    data = {
      outletPicId: postData.outletPicId ? postData.outletPicId.id : null,
      name: postData.name,
      updatePic: true
    };
    url = UPDATE_OUTLET_SERVICE;
  } else {
    data = {
      dealerId: postData.dealerId ? postData.dealerId.id : null,
      name: postData.name,
      typeId: postData.typeId ? postData.typeId.id : null,
      countryId: postData.countryId,
      stateId: postData.stateId ? postData.stateId.id : null,
      area: postData.area,
      postCode: postData.postCode,
      address: postData.address,
      outletPicId: postData.outletPicId ? postData.outletPicId.id : null,
      latitude: postData.latitude,
      longitude: postData.longitude,
      ownerAccId: ownerAccId,
      updatePic: true,
      dealerOutletCode: postData.dealerOutletCode
    };

    if (!postData.id) {
      data.status = "ACTIVE";
    }
  }

  if (postData.outletId || postData.id) {
    data.id = postData.outletId ? postData.outletId : postData.id;
    url = UPDATE_OUTLET_SERVICE;
  }
  // console.log(data);
  // alert(JSON.stringify(data));
  return await request({
    url: url,
    method: "put",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function outletBulkUpload(pData) {
  return await request({
    url: UPLOAD_BULK_OUTLET_SERVICE,
    method: "post",
    data: pData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getOutletWithPICList(pData) {
  return await request({
    url: "",
    method: "post",
    data: pData,
    timeout: DEFAULT_TIMEOUT
  });
}
