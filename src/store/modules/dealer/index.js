import {
  getDealerList,
  getDealerById,
  addOrUpdateDealer,
  submitDealerIncentiveList,
  getDealersOutletsList,
  getDealerSellInList,
  addDealerSellIn,
  getDealerSellOutList,
  addDealerSellOut,
  getDealerStockList,
  getDealerStockMonthlyList,
  downloadDealerStock,
  getDealerIncentiveList,
  getDealerUploadList,
  uploadByDealer,
  uploadByYearMonth
} from "@/api/dealer";
import {
  DEALER_LIST_REQUEST,
  DEALER_LIST_SUCCESS,
  DEALER_LIST_ERROR,
  DEALER_REQUEST,
  DEALER_SUCCESS,
  DEALER_ERROR,
  DEALER_POST_REQUEST,
  DEALER_POST_SUCCESS,
  DEALER_POST_ERROR,
  DEALER_INCENTIVE_POST_REQUEST,
  DEALER_INCENTIVE_POST_SUCCESS,
  DEALER_INCENTIVE_POST_ERROR,
  DEALERS_OUTLETS_LIST_REQUEST,
  DEALERS_OUTLETS_LIST_SUCCESS,
  DEALERS_OUTLETS_LIST_ERROR,
  DEALER_SELL_IN_LIST_REQUEST,
  DEALER_SELL_IN_LIST_SUCCESS,
  DEALER_SELL_IN_LIST_ERROR,
  DEALER_SELL_IN_ADD_REQUEST,
  DEALER_SELL_IN_ADD_SUCCESS,
  DEALER_SELL_IN_ADD_ERROR,
  DEALER_SELL_OUT_LIST_REQUEST,
  DEALER_SELL_OUT_LIST_SUCCESS,
  DEALER_SELL_OUT_LIST_ERROR,
  DEALER_SELL_OUT_ADD_REQUEST,
  DEALER_SELL_OUT_ADD_SUCCESS,
  DEALER_SELL_OUT_ADD_ERROR,
  DEALER_STOCK_LIST_REQUEST,
  DEALER_STOCK_LIST_SUCCESS,
  DEALER_STOCK_LIST_ERROR,
  DEALER_STOCK_LIST_MONTHLY_REQUEST,
  DEALER_STOCK_LIST_MONTHLY_SUCCESS,
  DEALER_STOCK_LIST_MONTHLY_ERROR,
  DEALER_STOCK_LIST_DOWNLOAD_REQUEST,
  DEALER_STOCK_LIST_DOWNLOAD_SUCCESS,
  DEALER_STOCK_LIST_DOWNLOAD_ERROR,
  DEALER_INCENTIVE_LIST_REQUEST,
  DEALER_INCENTIVE_LIST_SUCCESS,
  DEALER_INCENTIVE_LIST_ERROR,
  DEALER_INC_RECEIPT_LIST_REQUEST,
  DEALER_INC_RECEIPT_LIST_SUCCESS,
  DEALER_INC_RECEIPT_LIST_ERROR,
  RECEIPT_UPLOAD_BY_DEALER_REQUEST,
  RECEIPT_UPLOAD_BY_DEALER_SUCCESS,
  RECEIPT_UPLOAD_BY_DEALER_ERROR,
  RECEIPT_UPLOAD_BY_MONTH_REQUEST,
  RECEIPT_UPLOAD_BY_MONTH_SUCCESS,
  RECEIPT_UPLOAD_BY_MONTH_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  dealer: {},
  dealers: [],
  incentive: {},
  status: "",
  dealerOutlets: [],
  hasLoadedOnce: false
};

const getters = {
  getDealer: state => state.dealer,
  getDelaers: state => state.dealers
};

const actions = {
  [DEALER_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_LIST_REQUEST);
      getDealerList(postData)
        .then(resp => {
          commit(DEALER_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_POST_REQUEST);
      addOrUpdateDealer(postData)
        .then(resp => {
          commit(DEALER_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_REQUEST);
      getDealerById(postData)
        .then(resp => {
          commit(DEALER_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_INCENTIVE_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_INCENTIVE_POST_REQUEST);
      submitDealerIncentiveList(postData)
        .then(resp => {
          commit(DEALER_INCENTIVE_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_INCENTIVE_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALERS_OUTLETS_LIST_REQUEST]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(DEALERS_OUTLETS_LIST_REQUEST);
      getDealersOutletsList()
        .then(resp => {
          commit(DEALERS_OUTLETS_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALERS_OUTLETS_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_SELL_IN_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_SELL_IN_LIST_REQUEST);
      getDealerSellInList(postData)
        .then(resp => {
          commit(DEALER_SELL_IN_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_SELL_IN_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_SELL_IN_ADD_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_SELL_IN_ADD_REQUEST);
      addDealerSellIn(postData)
        .then(resp => {
          commit(DEALER_SELL_IN_ADD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_SELL_IN_ADD_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_SELL_OUT_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_SELL_OUT_LIST_REQUEST);
      getDealerSellOutList(postData)
        .then(resp => {
          commit(DEALER_SELL_OUT_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_SELL_OUT_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_SELL_OUT_ADD_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_SELL_OUT_ADD_REQUEST);
      addDealerSellOut(postData)
        .then(resp => {
          commit(DEALER_SELL_OUT_ADD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_SELL_OUT_ADD_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_STOCK_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_STOCK_LIST_REQUEST);
      getDealerStockList(postData)
        .then(resp => {
          commit(DEALER_STOCK_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_STOCK_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_STOCK_LIST_MONTHLY_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_STOCK_LIST_MONTHLY_REQUEST);
      getDealerStockMonthlyList(postData)
        .then(resp => {
          commit(DEALER_STOCK_LIST_MONTHLY_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_STOCK_LIST_MONTHLY_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_STOCK_LIST_DOWNLOAD_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_STOCK_LIST_DOWNLOAD_REQUEST);
      downloadDealerStock(postData)
        .then(resp => {
          commit(DEALER_STOCK_LIST_DOWNLOAD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_STOCK_LIST_DOWNLOAD_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_INCENTIVE_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_INCENTIVE_LIST_REQUEST);
      getDealerIncentiveList(postData)
        .then(resp => {
          commit(DEALER_INCENTIVE_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_INCENTIVE_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_INC_RECEIPT_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_INC_RECEIPT_LIST_REQUEST);
      getDealerUploadList(postData)
        .then(resp => {
          commit(DEALER_INC_RECEIPT_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_INC_RECEIPT_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [RECEIPT_UPLOAD_BY_DEALER_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(RECEIPT_UPLOAD_BY_DEALER_REQUEST);
      uploadByDealer(postData)
        .then(resp => {
          commit(RECEIPT_UPLOAD_BY_DEALER_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(RECEIPT_UPLOAD_BY_DEALER_ERROR, err);
          reject(err);
        });
    });
  },
  [RECEIPT_UPLOAD_BY_MONTH_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(RECEIPT_UPLOAD_BY_MONTH_REQUEST);
      uploadByYearMonth(postData)
        .then(resp => {
          commit(RECEIPT_UPLOAD_BY_MONTH_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(RECEIPT_UPLOAD_BY_MONTH_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  DEALER_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      dealers: data,
      hasLoadedOnce: true
    });
  },
  DEALER_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      dealers: [],
      hasLoadedOnce: true
    });
  },
  DEALER_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      dealer: data,
      hasLoadedOnce: true
    });
  },
  DELAER_ERROR: state => {
    Object.assign(state, {
      status: "error",
      dealer: {},
      hasLoadedOnce: true
    });
  },
  DEALER_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      dealer: data,
      hasLoadedOnce: true
    });
  },
  DEALER_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      dealer: {},
      hasLoadedOnce: true
    });
  },
  DEALER_INCENTIVE_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_INCENTIVE_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      incentive: data,
      hasLoadedOnce: true
    });
  },
  DEALER_INCENTIVE_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      incentive: {},
      hasLoadedOnce: true
    });
  },
  DEALERS_OUTLETS_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALERS_OUTLETS_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      dealerOutlets: data,
      hasLoadedOnce: true
    });
  },
  DEALERS_OUTLETS_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      dealerOutlets: [],
      hasLoadedOnce: true
    });
  },
  DEALER_SELL_IN_ADD_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_SELL_IN_ADD_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_SELL_IN_ADD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DEALER_SELL_IN_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_SELL_IN_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_SELL_IN_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DEALER_SELL_OUT_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_SELL_OUT_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_SELL_OUT_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DEALER_SELL_OUT_ADD_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_SELL_OUT_ADD_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_SELL_OUT_ADD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DEALER_STOCK_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_STOCK_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_STOCK_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DEALER_STOCK_LIST_MONTHLY_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_STOCK_LIST_MONTHLY_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_STOCK_LIST_MONTHLY_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DEALER_STOCK_LIST_DOWNLOAD_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_STOCK_LIST_DOWNLOAD_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_STOCK_LIST_DOWNLOAD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DEALER_INCENTIVE_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_INCENTIVE_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_INCENTIVE_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DEALER_INC_RECEIPT_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_INC_RECEIPT_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_INC_RECEIPT_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  RECEIPT_UPLOAD_BY_DEALER_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  RECEIPT_UPLOAD_BY_DEALER_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  RECEIPT_UPLOAD_BY_DEALER_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  RECEIPT_UPLOAD_BY_MONTH_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  RECEIPT_UPLOAD_BY_MONTH_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  RECEIPT_UPLOAD_BY_MONTH_ERROR: state => {
    Object.assign(state, {
      status: "error",
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
