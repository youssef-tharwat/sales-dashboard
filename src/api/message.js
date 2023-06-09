import request from "@/utils/request";
import {
  GET_MESSAGES_TREAD_BY_USER_SERVICE,
  GET_MESSAGES_TREAD_BY_COUNTRY_SERVICE,
  SEND_MESSGAE_BY_TREAD_SERVICE,
  GET_MESSAGES_TREAD_SERVICE,
  READ_MESSAGE_SERVICE,
  ADD_MESSAGE_TREAD_SERVICE,
  GET_UNREAD_MESSAGE_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function addMessageTread(postData) {
  return await request({
    url: ADD_MESSAGE_TREAD_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getMessagesTreadByUser(postData) {
  return await request({
    url: GET_MESSAGES_TREAD_BY_USER_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getMessagesTreadByCountry(postData) {
  // let userData = JSON.parse(localStorage.getItem('user'));
  // let countryId = 0;
  // if (userData) {
  //     postData.countryId = userData.user.createdCountryId;
  // }

  return await request({
    url: GET_MESSAGES_TREAD_BY_COUNTRY_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function sendMessage(postData) {
  return await request({
    url: SEND_MESSGAE_BY_TREAD_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getTreadMessageList(postData) {
  return await request({
    url: GET_MESSAGES_TREAD_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function setMessageAsRead(postData) {
  return await request({
    url: READ_MESSAGE_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getUnreadMessageCount(postData) {
  return await request({
    url: GET_UNREAD_MESSAGE_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
