import {
  getIncentiveNormalList,
  addIncentiveNormalList,
  getIncentiveNormalById,
  updateIncentiveNormalList,
  getBonusIncentiveUtility,
  getAllNormalIncentivesByCountry,
  getBonusIncentiveById,
  getBonusIncentiveList,
  addBonusIncentive,
  getGeneratedIncentivePayableFile,
  updateBonusIncentive,
  getTargetIncentiveById,
  getTargetIncentiveList,
  addTargetIncentive,
  updateTargetIncentive,
  getTargetIncentiveUtility,
  getAllIncentiveNormalMtm,
  getPayoutListByYear,
  getPromoterIncentiveList,
  addPromoterIncentive,
  updatePromoterIncentive,
  getPromoterIncentiveById,
  getPromoterIncentiveProductFamilyList
} from "@/api/incentive.js";

import {
  INCENTIVE_NORMAL_LIST_REQUEST,
  INCENTIVE_NORMAL_LIST_SUCCESS,
  INCENTIVE_NORMAL_LIST_ERROR,
  INCENTIVE_NORMAL_LIST_ADD,
  INCENTIVE_NORMAL_LIST_ADD_SUCCESS,
  INCENTIVE_NORMAL_LIST_ADD_ERROR,
  INCENTIVE_NORMAL_LIST_UPDATE,
  INCENTIVE_NORMAL_LIST_UPDATE_SUCCESS,
  INCENTIVE_NORMAL_LIST_UPDATE_ERROR,
  INCENTIVE_NORMAL_GET_BY_ID,
  INCENTIVE_NORMAL_GET_ALL_MTM,
  INCENTIVE_NORMAL_GET_ALL_MTM_SUCCESS,
  INCENTIVE_NORMAL_GET_ALL_MTM_ERROR,
  INCENTIVE_NORMAL_GET_BY_ID_SUCCESS,
  INCENTIVE_NORMAL_GET_BY_ID_ERROR,
  INCENTIVE_BONUS_UTILITY_REQUEST,
  INCENTIVE_BONUS_UTILITY_SUCCESS,
  INCENTIVE_BONUS_UTILITY_ERROR,
  INCENTIVE_NORMAL_ALL_REQUEST,
  INCENTIVE_NORMAL_ALL_SUCCESS,
  INCENTIVE_NORMAL_ALL_ERROR,
  INCENTIVE_BONUS_LIST_REQUEST,
  INCENTIVE_BONUS_LIST_SUCCESS,
  INCENTIVE_BONUS_LIST_ERROR,
  INCENTIVE_BONUS_ADD,
  INCENTIVE_BONUS_ADD_SUCCESS,
  INCENTIVE_BONUS_ADD_ERROR,
  INCENTIVE_PAYABLE_GENERATE_REQUEST,
  INCENTIVE_PAYABLE_GENERATE_SUCCESS,
  INCENTIVE_PAYABLE_GENERATE_ERROR,
  INCENTIVE_BONUS_UPDATE,
  INCENTIVE_BONUS_UPDATE_SUCCESS,
  INCENTIVE_BONUS_UPDATE_ERROR,
  INCENTIVE_BONUS_GET_BY_ID,
  INCENTIVE_BONUS_GET_BY_ID_SUCCESS,
  INCENTIVE_BONUS_GET_BY_ID_ERROR,
  INCENTIVE_TARGET_LIST_REQUEST,
  INCENTIVE_TARGET_LIST_SUCCESS,
  INCENTIVE_TARGET_LIST_ERROR,
  INCENTIVE_TARGET_ADD,
  INCENTIVE_TARGET_ADD_SUCCESS,
  INCENTIVE_TARGET_ADD_ERROR,
  INCENTIVE_TARGET_UPDATE,
  INCENTIVE_TARGET_UPDATE_SUCCESS,
  INCENTIVE_TARGET_UPDATE_ERROR,
  INCENTIVE_TARGET_GET_BY_ID,
  INCENTIVE_TARGET_GET_BY_ID_SUCCESS,
  INCENTIVE_TARGET_GET_BY_ID_ERROR,
  INCENTIVE_TARGET_UTILITY_REQUEST,
  INCENTIVE_TARGET_UTILITY_SUCCESS,
  INCENTIVE_TARGET_UTILITY_ERROR,
  GET_PAYOUT_BY_YEAR_ERROR,
  GET_PAYOUT_BY_YEAR_SUCCESS,
  GET_PAYOUT_BY_YEAR_REQUEST,
  INCENTIVE_PROMOTER_LIST_REQUEST,
  INCENTIVE_PROMOTER_LIST_SUCCESS,
  INCENTIVE_PROMOTER_LIST_ERROR,
  INCENTIVE_PROMOTER_ADD,
  INCENTIVE_PROMOTER_ADD_SUCCESS,
  INCENTIVE_PROMOTER_ADD_ERROR,
  INCENTIVE_PROMOTER_UPDATE,
  INCENTIVE_PROMOTER_UPDATE_SUCCESS,
  INCENTIVE_PROMOTER_UPDATE_ERROR,
  INCENTIVE_PROMOTER_GET_BY_ID,
  INCENTIVE_PROMOTER_GET_BY_ID_SUCCESS,
  INCENTIVE_PROMOTER_GET_BY_ID_ERROR,
  INCENTIVE_PROMOTER_PRODUCT_FAMILY_REQUEST,
  INCENTIVE_PROMOTER_PRODUCT_FAMILY_SUCCESS,
  INCENTIVE_PROMOTER_PRODUCT_FAMILY_ERROR
} from "./action";

const state = {
  token: localStorage.getItem("user-token") || "",
  incentiveNormalListData: [],
  incentive: {},
  productFamily: [],
  bonusUtility: [],
  payoutList: [],
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getIncentiveListNormalData: state => state.incentiveNormalListData,
  getIncentive: state => state.incentive,
  getProductFamily: state => state.productFamily
};

const mutations = {
  INCENTIVE_NORMAL_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_NORMAL_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      incentiveNormalListData: data,
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      incentiveNormalListData: [],
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_LIST_ADD: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_NORMAL_LIST_ADD_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_LIST_ADD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_LIST_UPDATE: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_NORMAL_LIST_UPDATE_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_LIST_UPDATE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_GET_BY_ID: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_NORMAL_GET_BY_ID_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_GET_BY_ID_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_GET_ALL_MTM: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_NORMAL_GET_ALL_MTM_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_GET_ALL_MTM_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_UTILITY_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_BONUS_UTILITY_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      bonusUtility: data,
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_UTILITY_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_ALL_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_NORMAL_ALL_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      incentive: data,
      hasLoadedOnce: true
    });
  },
  INCENTIVE_NORMAL_ALL_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_GET_BY_ID: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_BONUS_GET_BY_ID_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_GET_BY_ID_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_BONUS_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_ADD: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_BONUS_ADD_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_ADD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PAYABLE_GENERATE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_PAYABLE_GENERATE_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PAYABLE_GENERATE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_UPDATE: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_BONUS_UPDATE_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_BONUS_UPDATE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_GET_BY_ID: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_TARGET_GET_BY_ID_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_GET_BY_ID_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_TARGET_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_ADD: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_TARGET_ADD_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_ADD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_UPDATE: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_TARGET_UPDATE_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_UPDATE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_UTILITY_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_TARGET_UTILITY_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_TARGET_UTILITY_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  GET_PAYOUT_BY_YEAR_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_PAYOUT_BY_YEAR_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      payoutList: data,
      hasLoadedOnce: true
    });
  },
  GET_PAYOUT_BY_YEAR_ERROR: state => {
    Object.assign(state, {
      status: "error",
      payoutList: [],
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_PROMOTER_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_ADD: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_PROMOTER_ADD_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_ADD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_UPDATE: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_PROMOTER_UPDATE_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_UPDATE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_GET_BY_ID: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_PROMOTER_GET_BY_ID_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      incentive: data,
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_GET_BY_ID_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_PRODUCT_FAMILY_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  INCENTIVE_PROMOTER_PRODUCT_FAMILY_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      productFamily: data,
      hasLoadedOnce: true
    });
  },
  INCENTIVE_PROMOTER_PRODUCT_FAMILY_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  }
};

const actions = {
  [INCENTIVE_NORMAL_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_NORMAL_LIST_SUCCESS);
      getIncentiveNormalList(postData)
        .then(resp => {
          commit(INCENTIVE_NORMAL_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_NORMAL_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_NORMAL_ALL_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_NORMAL_ALL_REQUEST);
      getAllNormalIncentivesByCountry(postData)
        .then(resp => {
          commit(INCENTIVE_NORMAL_ALL_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_NORMAL_ALL_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_NORMAL_LIST_ADD]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_NORMAL_LIST_ADD);
      addIncentiveNormalList(postData)
        .then(resp => {
          commit(INCENTIVE_NORMAL_LIST_ADD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_NORMAL_LIST_ADD_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_NORMAL_LIST_UPDATE]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_NORMAL_LIST_UPDATE_SUCCESS);
      updateIncentiveNormalList(postData)
        .then(resp => {
          commit(INCENTIVE_NORMAL_LIST_ADD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_NORMAL_LIST_UPDATE_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_NORMAL_GET_BY_ID]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_NORMAL_GET_BY_ID);
      getIncentiveNormalById(postData)
        .then(resp => {
          commit(INCENTIVE_NORMAL_GET_BY_ID_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_NORMAL_GET_BY_ID_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_NORMAL_GET_ALL_MTM]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_NORMAL_GET_ALL_MTM);
      getAllIncentiveNormalMtm()
        .then(resp => {
          commit(INCENTIVE_NORMAL_GET_ALL_MTM_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_NORMAL_GET_ALL_MTM_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_BONUS_UTILITY_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_BONUS_UTILITY_REQUEST);
      getBonusIncentiveUtility(postData)
        .then(resp => {
          commit(INCENTIVE_BONUS_UTILITY_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_BONUS_UTILITY_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_BONUS_GET_BY_ID]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_BONUS_GET_BY_ID);
      getBonusIncentiveById(postData)
        .then(resp => {
          commit(INCENTIVE_BONUS_GET_BY_ID_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_BONUS_GET_BY_ID_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_BONUS_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_BONUS_ADD);
      getBonusIncentiveList(postData)
        .then(resp => {
          commit(INCENTIVE_BONUS_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_BONUS_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_BONUS_ADD]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_BONUS_ADD);
      addBonusIncentive(postData)
        .then(resp => {
          commit(INCENTIVE_BONUS_ADD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_BONUS_ADD_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_BONUS_UPDATE]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_BONUS_UPDATE);
      updateBonusIncentive(postData)
        .then(resp => {
          commit(INCENTIVE_BONUS_UPDATE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_BONUS_UPDATE_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_TARGET_GET_BY_ID]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_TARGET_GET_BY_ID);
      getTargetIncentiveById(postData)
        .then(resp => {
          commit(INCENTIVE_TARGET_GET_BY_ID_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_TARGET_GET_BY_ID_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_TARGET_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_TARGET_ADD);
      getTargetIncentiveList(postData)
        .then(resp => {
          commit(INCENTIVE_TARGET_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_TARGET_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_TARGET_ADD]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_TARGET_ADD);
      addTargetIncentive(postData)
        .then(resp => {
          commit(INCENTIVE_TARGET_ADD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_TARGET_ADD_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_TARGET_UPDATE]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_TARGET_UPDATE);
      updateTargetIncentive(postData)
        .then(resp => {
          commit(INCENTIVE_TARGET_UPDATE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_TARGET_UPDATE_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_PAYABLE_GENERATE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_PAYABLE_GENERATE_REQUEST);
      getGeneratedIncentivePayableFile(postData)
        .then(resp => {
          commit(INCENTIVE_PAYABLE_GENERATE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_PAYABLE_GENERATE_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_TARGET_UTILITY_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_TARGET_UTILITY_REQUEST);
      getTargetIncentiveUtility(postData)
        .then(resp => {
          commit(INCENTIVE_TARGET_UTILITY_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_TARGET_UTILITY_ERROR, err);
          reject(err);
        });
    });
  },
  [GET_PAYOUT_BY_YEAR_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_PAYOUT_BY_YEAR_REQUEST);
      getPayoutListByYear(postData)
        .then(resp => {
          commit(GET_PAYOUT_BY_YEAR_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_PAYOUT_BY_YEAR_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_PROMOTER_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_PROMOTER_LIST_REQUEST);
      getPromoterIncentiveList(postData)
        .then(resp => {
          commit(INCENTIVE_PROMOTER_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_PROMOTER_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_PROMOTER_ADD]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_PROMOTER_ADD);
      addPromoterIncentive(postData)
        .then(resp => {
          commit(INCENTIVE_PROMOTER_ADD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_PROMOTER_ADD_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_PROMOTER_UPDATE]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_PROMOTER_UPDATE);
      updatePromoterIncentive(postData)
        .then(resp => {
          commit(INCENTIVE_PROMOTER_UPDATE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_PROMOTER_UPDATE_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_PROMOTER_GET_BY_ID]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_PROMOTER_GET_BY_ID);
      getPromoterIncentiveById(postData)
        .then(resp => {
          commit(INCENTIVE_PROMOTER_GET_BY_ID_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_PROMOTER_GET_BY_ID_ERROR, err);
          reject(err);
        });
    });
  },
  [INCENTIVE_PROMOTER_PRODUCT_FAMILY_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(INCENTIVE_PROMOTER_PRODUCT_FAMILY_SUCCESS);
      getPromoterIncentiveProductFamilyList(postData)
        .then(resp => {
          commit(INCENTIVE_PROMOTER_PRODUCT_FAMILY_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(INCENTIVE_PROMOTER_PRODUCT_FAMILY_ERROR, err);
          reject(err);
        });
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
