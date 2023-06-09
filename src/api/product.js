import request from "@/utils/request";
import {
  API_PRODUCT_LIST_SERVICE,
  API_SINGLE_PRODUCT_SERVICE,
  ADD_PRODUCT_SERVICE,
  UPDATE_PRODUCT_SERVICE,
  UPLOAD_PRODUCT_GUILD_SERIVE,
  API_PRODUCT_SKU_LIST_SERVICE,
  ADD_PRODUCT_BULK_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getProductList(postData) {
  return await request({
    url: API_PRODUCT_LIST_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getProductSkuList(postData) {
  return await request({
    url: API_PRODUCT_SKU_LIST_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getProductById(postData) {
  return await request({
    url: API_SINGLE_PRODUCT_SERVICE + postData.id,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addOrUpdateProduct(postData) {
  let url = ADD_PRODUCT_SERVICE;
  let data = {};
  if (postData.status) {
    data = {
      bActive: !postData.bActive
    };
    url = UPDATE_PRODUCT_SERVICE;
  } else {
    data = {
      productGroupId: postData.productGroupId ? postData.productGroupId.id : null,
      productSubGroupId: postData.productSubGroupId ? postData.productSubGroupId.id : null,
      description: "",
      detailDescription: "",
      bActive: postData.bActive,
      name: postData.name,
      ownerIcOrId: postData.ownerId,
      imageFilename: postData.imageUrl1,
      deviceTypeId: postData.deviceTypeId ? postData.deviceTypeId.id : 0,
      model: postData.model,
      techSpec: postData.techSpec,
      features: postData.features,
      id: postData.productId,
      imageUrl1: postData.imageUrl1,
      imageUrl2: postData.imageUrl2,
      imageUrl3: postData.imageUrl3,
      imageUrl4: postData.imageUrl4,
      imageUrl5: postData.imageUrl5,
      productGroupText: postData.productGroupText,
      productSubGroupText: postData.productSubGroupText,
      videoUrl: postData.videoUrl,
      countryId: postData.countryId
    };

    if (postData.salesGuidePdf) {
      let pdf = postData.salesGuidePdf.split(";base64,");
      // console.log(image);
      data.salesGuidePdf = pdf[1];
      data.uploadFileName = postData.name + " Guide";
    }
  }

  if (postData.productId || postData.id) {
    data.id = postData.id ? postData.id : postData.productId;
    url = UPDATE_PRODUCT_SERVICE;
  }

  return await request({
    url: url,
    method: "put",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function productBulkUpload(postData) {
  return await request({
    url: ADD_PRODUCT_BULK_SERVICE,
    method: "put",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function uploadProductGuide(postData) {
  return await request({
    url: UPLOAD_PRODUCT_GUILD_SERIVE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
