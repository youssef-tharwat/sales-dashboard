import {
  getBulkSaleList,
  uploadBulkSale,
  getUnknownSerialList,
  getSalesData,
  downloadBulkSaleById,
  updateSalesData,
  downloadSalesData,
  checkSerialNumber
} from "@/api/sales";
import {
  GET_BULK_SALE_REQUEST,
  GET_BULK_SALE_SUCCESS,
  GET_BULK_SALE_ERROR,
  UPLOAD_BULK_SALE_REQUEST,
  UPLOAD_BULK_SALE_SUCCESS,
  UPLOAD_BULK_SALE_ERROR,
  UNKNOWN_SERIAL_REQUEST,
  UNKNOWN_SERIAL_SUCCESS,
  UNKNOWN_SERIAL_ERROR,
  GET_SALES_DATA_REQUEST,
  GET_SALES_DATA_SUCCESS,
  GET_SALES_DATA_ERROR,
  DOWNLOAD_BULK_SALE_REQUEST,
  DOWNLOAD_BULK_SALE_SUCCESS,
  DOWNLOAD_BULK_SALE_ERROR,
  UPDATE_SALES_DATA_REQUEST,
  UPDATE_SALES_DATA_SUCCESS,
  UPDATE_SALES_DATA_ERROR,
  DOWNLOAD_SALES_DATA_REQUEST,
  DOWNLOAD_SALES_DATA_SUCCESS,
  DOWNLOAD_SALES_DATA_ERROR,
  CHECK_SERIAL_REQUEST,
  CHECK_SERIAL_SUCCESS,
  CHECK_SERIAL_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  bulkSales: [],
  serialList: [],
  salesData: [],
  bulkSaleData: [],
  status: "",
  hasLoadedOnce: false
};

const getters = {
  bulkSales: state => state.sales
};

const actions = {
  [GET_BULK_SALE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_BULK_SALE_REQUEST);
      getBulkSaleList(postData)
        .then(resp => {
          commit(GET_BULK_SALE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_BULK_SALE_ERROR, err);
          reject(err);
        });
    });
  },
  [UPLOAD_BULK_SALE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(UPLOAD_BULK_SALE_REQUEST);
      uploadBulkSale(postData)
        .then(resp => {
          commit(UPLOAD_BULK_SALE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(UPLOAD_BULK_SALE_ERROR, err);
          reject(err);
        });
    });
  },
  [DOWNLOAD_BULK_SALE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DOWNLOAD_BULK_SALE_REQUEST);
      downloadBulkSaleById(postData)
        .then(resp => {
          commit(DOWNLOAD_BULK_SALE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DOWNLOAD_BULK_SALE_ERROR, err);
          reject(err);
        });
    });
  },
  [UNKNOWN_SERIAL_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(UNKNOWN_SERIAL_REQUEST);
      getUnknownSerialList(postData)
        .then(resp => {
          commit(UNKNOWN_SERIAL_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(UNKNOWN_SERIAL_ERROR, err);
          reject(err);
        });
    });
  },
  [GET_SALES_DATA_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_SALES_DATA_REQUEST);
      getSalesData(postData)
        .then(resp => {
          commit(GET_SALES_DATA_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_SALES_DATA_ERROR, err);
          reject(err);
        });
    });
  },
  [UPDATE_SALES_DATA_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(UPDATE_SALES_DATA_REQUEST);
      updateSalesData(postData)
        .then(resp => {
          commit(UPDATE_SALES_DATA_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(UPDATE_SALES_DATA_ERROR, err);
          reject(err);
        });
    });
  },
  [DOWNLOAD_SALES_DATA_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DOWNLOAD_SALES_DATA_REQUEST);
      downloadSalesData(postData)
        .then(resp => {
          commit(DOWNLOAD_SALES_DATA_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DOWNLOAD_SALES_DATA_ERROR, err);
          reject(err);
        });
    });
  },
  [CHECK_SERIAL_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(CHECK_SERIAL_REQUEST);
      checkSerialNumber(postData)
        .then(resp => {
          commit(CHECK_SERIAL_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(CHECK_SERIAL_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  GET_BULK_SALE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_BULK_SALE_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      sales: data,
      hasLoadedOnce: true
    });
  },
  GET_BULK_SALE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      sales: [],
      hasLoadedOnce: true
    });
  },
  UPLOAD_BULK_SALE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  UPLOAD_BULK_SALE_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      sales: data,
      hasLoadedOnce: true
    });
  },
  UPLOAD_BULK_SALE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      sales: [],
      hasLoadedOnce: true
    });
  },
  UNKNOWN_SERIAL_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  UNKNOWN_SERIAL_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      serialList: data,
      hasLoadedOnce: true
    });
  },
  UNKNOWN_SERIAL_ERROR: state => {
    Object.assign(state, {
      status: "error",
      serialList: [],
      hasLoadedOnce: true
    });
  },
  GET_SALES_DATA_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_SALES_DATA_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      salesData: data,
      hasLoadedOnce: true
    });
  },
  GET_SALES_DATA_ERROR: state => {
    Object.assign(state, {
      status: "error",
      salesData: [],
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_BULK_SALE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DOWNLOAD_BULK_SALE_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      bulkSaleData: data,
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_BULK_SALE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      bulkSaleData: [],
      hasLoadedOnce: true
    });
  },
  UPDATE_SALES_DATA_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  UPDATE_SALES_DATA_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      salesData: data,
      hasLoadedOnce: true
    });
  },
  UPDATE_SALES_DATA_ERROR: state => {
    Object.assign(state, {
      status: "error",
      salesData: [],
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_SALES_DATA_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DOWNLOAD_SALES_DATA_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      salesData: data,
      hasLoadedOnce: true
    });
  },
  DOWNLOAD_SALES_DATA_ERROR: state => {
    Object.assign(state, {
      status: "error",
      serialList: [],
      hasLoadedOnce: true
    });
  },
  CHECK_SERIAL_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  CHECK_SERIAL_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      serialList: data,
      hasLoadedOnce: true
    });
  },
  CHECK_SERIAL_ERROR: state => {
    Object.assign(state, {
      status: "error",
      serialData: [],
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
