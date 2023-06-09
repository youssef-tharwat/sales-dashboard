import {
  getBankList,
  getCategoryList,
  getStateList,
  getCountryList,
  getGenderList,
  getNewsTargetList,
  getProductTypeList,
  getProductGroupList,
  getSalesStatusList,
  getSerialTypeList,
  getCheckStatusList,
  getFailedReasonList,
  getIncentiveTargetTypeList,
  getTargetSaleTypeList,
  getPromoterTypeList
} from "@/api/utility";
import {
  BANK_LIST_SUCCESS,
  BANK_LIST_REQUEST,
  BANK_LIST_ERROR,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_ERROR,
  STATE_LIST_REQUEST,
  STATE_LIST_SUCCESS,
  STATE_LIST_ERROR,
  COUNTRY_LIST_REQUEST,
  COUNTRY_LIST_SUCCESS,
  COUNTRY_LIST_ERROR,
  GENDER_LIST_REQUEST,
  GENDER_LIST_SUCCESS,
  GENDER_LIST_ERROR,
  NEWS_TARGET_LIST_REQUEST,
  NEWS_TARGET_LIST_SUCCESS,
  NEWS_TARGET_LIST_ERROR,
  PRODUCT_TYPE_LIST_REQUEST,
  PRODUCT_TYPE_LIST_SUCCESS,
  PRODUCT_TYPE_LIST_ERROR,
  PRODUCT_GROUP_LIST_REQUEST,
  PRODUCT_GROUP_LIST_SUCCESS,
  PRODUCT_GROUP_LIST_ERROR,
  SALES_STATUS_LIST_REQUEST,
  SALES_STATUS_LIST_SUCCESS,
  SALES_STATUS_LIST_ERROR,
  SERIAL_TYPE_LIST_REQUEST,
  SERIAL_TYPE_LIST_SUCCESS,
  SERIAL_TYPE_LIST_ERROR,
  CHECK_STATUS_REQUEST,
  CHECK_STATUS_SUCCESS,
  CHECK_STATUS_ERROR,
  FAILED_REASON_REQUEST,
  FAILED_REASON_SUCCESS,
  FAILED_REASON_ERROR,
  INC_TARGET_TYPE_REQUEST,
  INC_TARGET_TYPE_SUCCESS,
  INC_TARGET_TYPE_ERROR,
  TARGET_SALE_TYPE_REQUEST,
  TARGET_SALE_TYPE_SUCCESS,
  TARGET_SALE_TYPE_ERROR,
  PROMOTER_TYPE_LIST_REQUEST,
  PROMOTER_TYPE_LIST_SUCCESS,
  PROMOTER_TYPE_LIST_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  banks: [],
  states: [],
  categories: [],
  countries: [],
  genders: [],
  ntargets: [],
  productGroups: [],
  getProductTypes: [],
  saleStatus: [],
  serialTypes: [],
  checkStatus: [],
  failedReasons: [],
  status: "",
  hasLoadedOnce: false,
  targetTypes: [],
  targetSaleTypes: [],
  promoterTypes: []
};

const getters = {
  getBanks: state => state.banks,
  getStates: state => state.states,
  getCategories: state => state.categories,
  getNewsTargets: state => state.ntargets,
  getProductTypes: state => state.productTypes,
  productGroups: state => state.productGroups,
  getGenders: state => state.genders,
  getSerialTypes: state => state.serialTypes,
  getFailedReasons: state => state.failedReasons,
  getIncTargetTypes: state => state.targetTypes,
  getTargetSaleTypes: state => state.targetSaleTypes,
  getPromoterTypes: state => state.promoterTypes
};

const actions = {
  [BANK_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(BANK_LIST_REQUEST);
      getBankList(postData)
        .then(resp => {
          commit(BANK_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(BANK_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [CATEGORY_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(CATEGORY_LIST_REQUEST);
      getCategoryList(postData)
        .then(resp => {
          commit(CATEGORY_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(CATEGORY_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [STATE_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(STATE_LIST_REQUEST);
      getStateList(postData)
        .then(resp => {
          commit(STATE_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(STATE_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [BANK_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(BANK_LIST_REQUEST);
      getBankList(postData)
        .then(resp => {
          commit(BANK_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(BANK_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [COUNTRY_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(COUNTRY_LIST_REQUEST);
      getCountryList(postData)
        .then(resp => {
          commit(COUNTRY_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(COUNTRY_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [GENDER_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GENDER_LIST_REQUEST);
      getGenderList(postData)
        .then(resp => {
          commit(GENDER_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GENDER_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [NEWS_TARGET_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(NEWS_TARGET_LIST_REQUEST);
      getNewsTargetList(postData)
        .then(resp => {
          commit(NEWS_TARGET_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(NEWS_TARGET_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [PRODUCT_TYPE_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_TYPE_LIST_REQUEST);
      getProductTypeList(postData)
        .then(resp => {
          commit(PRODUCT_TYPE_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_TYPE_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [PRODUCT_GROUP_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_GROUP_LIST_REQUEST);
      getProductGroupList(postData)
        .then(resp => {
          commit(PRODUCT_GROUP_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_GROUP_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [SALES_STATUS_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(SALES_STATUS_LIST_REQUEST);
      getSalesStatusList(postData)
        .then(resp => {
          commit(SALES_STATUS_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(SALES_STATUS_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [SERIAL_TYPE_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(SERIAL_TYPE_LIST_REQUEST);
      getSerialTypeList(postData)
        .then(resp => {
          commit(SERIAL_TYPE_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(SERIAL_TYPE_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [CHECK_STATUS_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(CHECK_STATUS_REQUEST);
      getCheckStatusList(postData)
        .then(resp => {
          commit(CHECK_STATUS_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(CHECK_STATUS_ERROR, err);
          reject(err);
        });
    });
  },
  [FAILED_REASON_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(FAILED_REASON_REQUEST);
      getFailedReasonList(postData)
        .then(resp => {
          commit(FAILED_REASON_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(FAILED_REASON_ERROR, err);
          reject(err);
        });
    });
  },
  [INC_TARGET_TYPE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INC_TARGET_TYPE_REQUEST);
      getIncentiveTargetTypeList(postData)
        .then(resp => {
          commit(INC_TARGET_TYPE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INC_TARGET_TYPE_ERROR, err);
          reject(err);
        });
    });
  },
  [TARGET_SALE_TYPE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(TARGET_SALE_TYPE_REQUEST);
      getTargetSaleTypeList(postData)
        .then(resp => {
          commit(TARGET_SALE_TYPE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(TARGET_SALE_TYPE_ERROR, err);
          reject(err);
        });
    });
  },
  [PROMOTER_TYPE_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PROMOTER_TYPE_LIST_REQUEST);
      getPromoterTypeList(postData)
        .then(resp => {
          commit(PROMOTER_TYPE_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PROMOTER_TYPE_LIST_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  BANK_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  BANK_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      banks: data,
      hasLoadedOnce: true
    });
  },
  BANK_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      banks: [],
      hasLoadedOnce: true
    });
  },
  CATEGORY_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  CATEGORY_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      categories: data,
      hasLoadedOnce: true
    });
  },
  CATEGORY_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      categories: [],
      hasLoadedOnce: true
    });
  },
  COUNTRY_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  COUNTRY_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      countries: data,
      hasLoadedOnce: true
    });
  },
  COUNTRY_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      countries: [],
      hasLoadedOnce: true
    });
  },
  STATE_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  STATE_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      states: data,
      hasLoadedOnce: true
    });
  },
  STATE_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      states: [],
      hasLoadedOnce: true
    });
  },
  NEWS_TARGET_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  NEWS_TARGET_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      ntargets: data,
      hasLoadedOnce: true
    });
  },
  NEWS_TARGET_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      ntargets: [],
      hasLoadedOnce: true
    });
  },
  PRODUCT_TYPE_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PRODUCT_TYPE_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      productTypes: data,
      hasLoadedOnce: true
    });
  },
  PRODUCT_TYPE_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      productTypes: [],
      hasLoadedOnce: true
    });
  },
  PRODUCT_GROUP_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PRODUCT_GROUP_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      productGroups: data,
      hasLoadedOnce: true
    });
  },
  PRODUCT_GROUP_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      productGroups: [],
      hasLoadedOnce: true
    });
  },
  SALES_STATUS_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  SALES_STATUS_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      saleStatus: data,
      hasLoadedOnce: true
    });
  },
  SALES_STATUS_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      saleStatus: [],
      hasLoadedOnce: true
    });
  },
  SERIAL_TYPE_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  SERIAL_TYPE_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      serialTypes: data,
      hasLoadedOnce: true
    });
  },
  SERIAL_TYPE_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      serialTypes: [],
      hasLoadedOnce: true
    });
  },
  CHECK_STATUS_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  CHECK_STATUS_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      checkStatus: data,
      hasLoadedOnce: true
    });
  },
  CHECK_STATUS_ERROR: state => {
    Object.assign(state, {
      status: "error",
      checkStatus: [],
      hasLoadedOnce: true
    });
  },
  FAILED_REASON_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  FAILED_REASON_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      failedReasons: data,
      hasLoadedOnce: true
    });
  },
  FAILED_REASON_ERROR: state => {
    Object.assign(state, {
      status: "error",
      failedReasons: [],
      hasLoadedOnce: true
    });
  },
  GENDER_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GENDER_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      genders: data,
      hasLoadedOnce: true
    });
  },
  GENDER_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      genders: [],
      hasLoadedOnce: true
    });
  },
  INC_TARGET_TYPE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INC_TARGET_TYPE_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      targetTypes: data,
      hasLoadedOnce: true
    });
  },
  INC_TARGET_TYPE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      targetTypes: [],
      hasLoadedOnce: true
    });
  },
  TARGET_SALE_TYPE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  TARGET_SALE_TYPE_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      targetSaleTypes: data,
      hasLoadedOnce: true
    });
  },
  TARGET_SALE_TYPE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      targetSaleTypes: [],
      hasLoadedOnce: true
    });
  },
  PROMOTER_TYPE_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PROMOTER_TYPE_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      promoterTypes: data,
      hasLoadedOnce: true
    });
  },
  PROMOTER_TYPE_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      promoterTypes: [],
      hasLoadedOnce: true
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
