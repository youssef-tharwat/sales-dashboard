import request from "@/utils/request";
import {
  API_DASHBOARD_TOP_ROW_DATA_SERVICE,
  API_REGIONAL_DASHBOARD_DATA_SERVICE,
  API_DASHBOARD_TOP_FILTERS_SERVICE,
  API_DASHBOARD_PRODUCT_FILTERS_SERVICE,
  API_DASHBOARD_COMPONENT_FILTERS_SERVICE,
  API_COUNTRY_DASHBOARD_FILTERS_SERVICE,
  API_COUNTRY_DASHBOARD_PRODUCT_FILTERS_SERVICE,
  API_COUNTRY_DASHBOARD_COMPONENT_FILTERS_SERVICE,
  API_COUNTRY_DASHBOARD_DATA_SERVICE
} from "../constants/services";
import { DEFAULT_TIMEOUT } from "../constants/index";

export function topRowDataGet(postData) {
  return request({
    url: API_DASHBOARD_TOP_ROW_DATA_SERVICE,
    method: "post",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getRegionalDashboard(postData) {
  const url = `${API_REGIONAL_DASHBOARD_DATA_SERVICE}/${postData.grouping}/data${
    postData.filters.countrySelected ? `?ccf=${postData.filters.countrySelected.value}` : ``
  }${postData.filters.yearSelected ? `&fyf=${postData.filters.yearSelected.value}` : ``}${
    postData.filters.quarterSelected ? `&qf=${postData.filters.quarterSelected.value}` : ``
  }${postData.filters.unitSelected ? `&tf=${postData.filters.unitSelected.value}` : ``}${
    postData.filters.currencySelected ? `&cf=${postData.filters.currencySelected.value}` : ``
  }${
    postData.productFilters.catbcsSelected
      ? `&catbcs=${postData.productFilters.catbcsSelected.value}`
      : ``
  }${
    postData.productFilters.cmpbcsSelected
      ? `&cmpbcs=${postData.productFilters.cmpbcsSelected.value}`
      : ``
  }${
    postData.productFilters.cmpsSelected
      ? `&cmps=${postData.productFilters.cmpsSelected.value}`
      : ``
  }${
    postData.productFilters.cmpwsSelected
      ? `&cmpws=${postData.productFilters.cmpwsSelected.value}`
      : ``
  }${
    postData.productFilters.catwsSelected
      ? `&catws=${postData.productFilters.catwsSelected.value}`
      : ``
  }`;
  return request({
    url: url,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}

export function topFiltersGet(postData) {
  return request({
    url: API_DASHBOARD_TOP_FILTERS_SERVICE,
    method: "get",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function productFiltersGet(postData) {
  return request({
    url: API_DASHBOARD_PRODUCT_FILTERS_SERVICE,
    method: "get",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function componentFiltersGet(postData) {
  return request({
    url: API_DASHBOARD_COMPONENT_FILTERS_SERVICE,
    method: "get",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

//Country Dashboard
export function getCdTopFilters(postData) {
  return request({
    url: API_COUNTRY_DASHBOARD_FILTERS_SERVICE,
    method: "get",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getCdProductFilters(postData) {
  return request({
    url: API_COUNTRY_DASHBOARD_PRODUCT_FILTERS_SERVICE,
    method: "get",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getCdComponentFilters(postData) {
  return request({
    url: API_COUNTRY_DASHBOARD_COMPONENT_FILTERS_SERVICE,
    method: "get",
    data: postData,
    timeout: DEFAULT_TIMEOUT
  });
}

export function getCountryDashboard(postData) {
  const url = `${API_COUNTRY_DASHBOARD_DATA_SERVICE}/${postData.grouping}/data${
    postData.filters.countrySelected ? `?countryCode=${postData.filters.countrySelected}` : ``
  }${postData.filters.yearSelected ? `&fyf=${postData.filters.yearSelected.value}` : ``}${
    postData.filters.quarterSelected ? `&qf=${postData.filters.quarterSelected.value}` : ``
  }${postData.filters.unitSelected ? `&tf=${postData.filters.unitSelected.value}` : ``}${
    postData.filters.currencySelected ? `&cf=${postData.filters.currencySelected.value}` : ``
  }${
    postData.productFilters.catbcsSelected
      ? `&catbcs=${postData.productFilters.catbcsSelected.value}`
      : ``
  }${
    postData.productFilters.cmpbcsSelected
      ? `&cmpbcs=${postData.productFilters.cmpbcsSelected.value}`
      : ``
  }${
    postData.productFilters.cmpsSelected
      ? `&cmps=${postData.productFilters.cmpsSelected.value}`
      : ``
  }${
    postData.productFilters.cmpwsSelected
      ? `&cmpws=${postData.productFilters.cmpwsSelected.value}`
      : ``
  }${
    postData.productFilters.catwsSelected
      ? `&catws=${postData.productFilters.catwsSelected.value}`
      : ``
  }`;
  return request({
    url: url,
    method: "get",
    timeout: DEFAULT_TIMEOUT
  });
}
