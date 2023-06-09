import request from "@/utils/request";
import {
  PENDING_SALESPERSON_LIST_SERVICE,
  APPROVE_REJECT_SALESPERSON_SERVICE,
  GET_PROMOTER_LEADERS_SERVICE,
  GET_SALESPERSON_LIST_SERVICE,
  ADD_PROMOTER_LEADER_SERVICE,
  ADD_PROMOTER_SERVICE,
  ADD_SALESPERSON_SERVICE,
  UPDATE_PROMOTER_LEADER_SERVICE,
  UPDATE_PROMOTER_SERVICE,
  UPDATE_SALESPERSON_SERVICE,
  GET_PROMOTERS_WITH_OUTLETS_SERVICE,
  GET_ACTIVE_PROMOTERS_WITH_OUTLETS_SERVICE,
  ASSIGN_PROMOTER_OUTLET_SERVICE,
  UNASSIGN_PROMOTER_OUTLET_SERVICE,
  ADD_STATE_MANAGER_SERVICE,
  UPDATE_STATE_MANAGER_SERVICE,
  GET_STATE_MANAGER_LIST_SERVICE,
  GET_REGIONAL_MANAGER_LIST_SERVICE,
  UPDATE_REGIONAL_MANAGER_SERVICE,
  ADD_REGIONAL_MANAGER_SERVICE
} from "../constants/services";

import { DEFAULT_TIMEOUT } from "../constants/index";

export async function getPendingSalespList(postData) {
  let country = "";
  if (postData.countryId) {
    country += "/" + postData.countryId;
  }
  return await request({
    url: PENDING_SALESPERSON_LIST_SERVICE + country,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function approveOrRejectSalesperson(postData) {
  const data = {
    id: postData.id,
    action: postData.action ? true : false
  };
  return await request({
    url: APPROVE_REJECT_SALESPERSON_SERVICE,
    method: "put",
    data: data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getStaffList(postData) {
  let countryId = postData.countryId ? "/" + postData.countryId : "";

  var url = "";
  if (postData.type == "leaders") {
    url = GET_PROMOTER_LEADERS_SERVICE + countryId;
  } else if (postData.type == "promoters") {
    url = GET_PROMOTERS_WITH_OUTLETS_SERVICE + countryId; //GET_PROMOTER_LIST_SERVICE;
  } else if (postData.type == "salespersons") {
    url = GET_SALESPERSON_LIST_SERVICE + countryId;
  } else if (postData.type == "stateManagers") {
    url = GET_STATE_MANAGER_LIST_SERVICE + countryId;
  } else if (postData.type == "regionalManagers") {
    url = GET_REGIONAL_MANAGER_LIST_SERVICE + countryId;
  }

  return await request({
    url: url,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function getActivePromoters(postData) {
  return await request({
    url: GET_ACTIVE_PROMOTERS_WITH_OUTLETS_SERVICE,
    method: "get",
    params: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addOrUpdateStaff(postData) {
  let url = "";
  let method = "post";
  if (postData.type == "leaders") {
    if (postData.staffId > 0) {
      postData.id = postData.staffId;
      url = UPDATE_PROMOTER_LEADER_SERVICE;
      method = "put";
      // alert(postData.staffId);
    } else {
      // postData.id = null;
      url = ADD_PROMOTER_LEADER_SERVICE;
      method = "post";
    }
  } else if (postData.type == "promoters") {
    if (postData.staffId > 0) {
      postData.id = postData.staffId;
      url = UPDATE_PROMOTER_SERVICE;
      method = "put";
    } else {
      // postData.id = null;
      url = ADD_PROMOTER_SERVICE;
      method = "post";
    }
  } else if (postData.type == "salespersons") {
    if (postData.staffId > 0) {
      postData.id = postData.staffId;
      url = UPDATE_SALESPERSON_SERVICE;
      method = "put";
    } else {
      // postData.id = null;
      url = ADD_SALESPERSON_SERVICE;
      method = "post";
    }
  } else if (postData.type === "stateManager") {
    if (postData.staffId > 0) {
      postData.id = postData.staffId;
      url = UPDATE_STATE_MANAGER_SERVICE;
      method = "put";
    } else {
      url = ADD_STATE_MANAGER_SERVICE;
      method = "post";
    }
  } else if (postData.type === "regionalManager") {
    if (postData.staffId > 0) {
      postData.id = postData.staffId;
      url = UPDATE_REGIONAL_MANAGER_SERVICE;
      method = "put";
    } else {
      url = ADD_REGIONAL_MANAGER_SERVICE;
      method = "post";
    }
  }

  return await request({
    url: url,
    method: method,
    data: postData.data,
    timeout: DEFAULT_TIMEOUT
  });
}

export async function addOrUpdatePromoterOutlet(postData) {
  let url = ASSIGN_PROMOTER_OUTLET_SERVICE;
  if (postData.type === 0) {
    url = UNASSIGN_PROMOTER_OUTLET_SERVICE;
  } else {
    url = ASSIGN_PROMOTER_OUTLET_SERVICE;
  }
  return await request({
    url: url,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}
