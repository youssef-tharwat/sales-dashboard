import request from "@/utils/request";
import {
  API_NEWS_LIST_SERVICE,
  API_SINGLE_NEWS_SERVICE,
  DELETE_NEWS_SERVICE,
  ADD_NEWS_SERVICE,
  UPLOAD_NEWS_IMAGE_SERVICE,
  UPDATE_NEWS_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getNewsList(postData) {
  // let userData = JSON.parse(localStorage.getItem('user'));
  // let countryId = 0;
  // if (userData) {
  //     countryId = userData.user.createdCountryId;
  // }

  return await request({
    url: API_NEWS_LIST_SERVICE + postData.countryId,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getNewsById(postData) {
  const data = {
    id: postData.id
  };
  return await request({
    url: API_SINGLE_NEWS_SERVICE,
    method: "get",
    data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function deleteNewsById(postData) {
  const data = {
    id: postData.id
  };
  return await request({
    url: DELETE_NEWS_SERVICE + postData.id,
    method: "delete",
    data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addOrUpdateNews(postData) {
  // const data = postData;
  let url = ADD_NEWS_SERVICE;
  let method = "post";
  let data = {};
  // let userData = JSON.parse(localStorage.getItem('user'));
  // let countryId = 0;
  // if (userData) {
  //     countryId = userData.user.createdCountryId;
  // }
  // console.log(postData);
  data.countryId = postData.countryId;
  data.header = postData.header;
  data.content = postData.content;
  data.announcementDate = postData.announcementDate;
  data.videoLink = postData.videoLink;
  data.pdfLink = postData.pdfLink;
  data.imagelink = postData.imageLink;
  data.bActive = postData.bActive;
  if (postData.newsImage) {
    let image = postData.newsImage.split(";base64,");
    // console.log(image);
    data.newsImage = image[1];
  }

  if (postData.newsPdf) {
    let pdf = postData.newsPdf.split(";base64,");
    // console.log(image);
    data.newsPDF = pdf[1];
  }

  data.target = postData.target;
  data.state = postData.state;

  if (postData.id) {
    data.id = postData.id;
    url = UPDATE_NEWS_SERVICE;
    method = "put";
  } else {
    data.bActive = true;
    method = "post";
  }

  return await request({
    url: url,
    method: method,
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function uploadNewsImage(postData) {
  // const data = postData;
  let data = {};
  data.newsImage = postData.id;
  data.newsImage = postData.image;

  if (postData.id) {
    data.id = postData.id;
  }

  return await request({
    url: UPLOAD_NEWS_IMAGE_SERVICE,
    method: "post",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}
