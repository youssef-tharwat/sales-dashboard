import {
  downloadPromoterAttendance,
  downloadIncentivePayableFile,
  downloadNormalIncentiveEntitlement,
  downloadBonusIncentiveEntitlement,
  downloadTargetIncentiveEntitlement,
  downloadDealerIncentiveEntitlement
} from "@/api/reports";
import {
  DOWNLOAD_PROMOTER_ATTENDANCE_REQUEST,
  DOWNLOAD_PROMOTER_ATTENDANCE_SUCCESS,
  DOWNLOAD_PROMOTER_ATTENDANCE_ERROR,
  DOWNLOAD_INCENTIVE_PAYABLE_REQUEST,
  DOWNLOAD_INCENTIVE_PAYABLE_SUCCESS,
  DOWNLOAD_INCENTIVE_PAYABLE_ERROR,
  DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_REQUEST,
  DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_SUCCESS,
  DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_ERROR,
  DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_REQUEST,
  DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_SUCCESS,
  DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_ERROR,
  DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_REQUEST,
  DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_SUCCESS,
  DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_ERROR,
  DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_REQUEST,
  DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_SUCCESS,
  DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  attendance: [],
  status: "",
  incentivesD: [],
  hasLoadedOnce: false,
  normalInceEnt: [],
  bonusInceEnt: [],
  targetInceEnt: [],
  dealerInceEnt: []
};

const getters = {
  getAttendance: state => state.attendance,
  getNormalEntitlement: state => state.normalInceEnt,
  getBonusEntitlement: state => state.bonusInceEnt,
  getTargetEntitlement: state => state.targetInceEnt,
  getDealerEntitlement: state => state.dealerInceEnt
};

const actions = {
  [DOWNLOAD_PROMOTER_ATTENDANCE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DOWNLOAD_PROMOTER_ATTENDANCE_REQUEST);
      downloadPromoterAttendance(postData)
        .then(resp => {
          commit(DOWNLOAD_PROMOTER_ATTENDANCE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DOWNLOAD_PROMOTER_ATTENDANCE_ERROR, err);
          reject(err);
        });
    });
  },
  [DOWNLOAD_INCENTIVE_PAYABLE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DOWNLOAD_INCENTIVE_PAYABLE_REQUEST);
      downloadIncentivePayableFile(postData)
        .then(resp => {
          commit(DOWNLOAD_INCENTIVE_PAYABLE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DOWNLOAD_INCENTIVE_PAYABLE_ERROR, err);
          reject(err);
        });
    });
  },
  [DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_REQUEST);
      downloadNormalIncentiveEntitlement(postData)
        .then(resp => {
          commit(DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_ERROR, err);
          reject(err);
        });
    });
  },
  [DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_REQUEST);
      downloadBonusIncentiveEntitlement(postData)
        .then(resp => {
          commit(DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_ERROR, err);
          reject(err);
        });
    });
  },
  [DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_REQUEST);
      downloadTargetIncentiveEntitlement(postData)
        .then(resp => {
          commit(DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_ERROR, err);
          reject(err);
        });
    });
  },
  [DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_REQUEST);
      downloadDealerIncentiveEntitlement(postData)
        .then(resp => {
          commit(DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  DOWNLOAD_PROMOTER_ATTENDANCE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DOWNLOAD_PROMOTER_ATTENDANCE_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      attendance: data,
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_PROMOTER_ATTENDANCE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      attendance: [],
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_INCENTIVE_PAYABLE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DOWNLOAD_INCENTIVE_PAYABLE_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      incentivesD: data,
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_INCENTIVE_PAYABLE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      incentivesD: [],
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      normalInceEnt: data,
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_NORMAL_INCENTIVE_ENTITLEMENT_ERROR: state => {
    Object.assign(state, {
      status: "error",
      normalInceEnt: [],
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      bonusInceEnt: data,
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_BONUS_INCENTIVE_ENTITLEMENT_ERROR: state => {
    Object.assign(state, {
      status: "error",
      bonusInceEnt: [],
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      targetInceEnt: data,
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_ERROR: state => {
    Object.assign(state, {
      status: "error",
      targetInceEnt: [],
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      dealerInceEnt: data,
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_DEALER_INCENTIVE_ENTITLEMENT_ERROR: state => {
    Object.assign(state, {
      status: "error",
      dealerInceEnt: [],
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
