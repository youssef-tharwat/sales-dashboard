import {
  getPendingSalespList,
  approveOrRejectSalesperson,
  getStaffList,
  getActivePromoters,
  addOrUpdateStaff,
  addOrUpdatePromoterOutlet
} from "@/api/staff";
import {
  PENDING_SALESP_LIST_REQUEST,
  PENDING_SALESP_LIST_ERROR,
  PENDING_SALESP_LIST_SUCCESS,
  PENDING_SALESP_STATUS_REQUEST,
  PENDING_SALESP_STATUS_SUCCESS,
  PENDING_SALESP_STATUS_ERROR,
  GET_STAFF_LIST_REQUEST,
  GET_STAFF_LIST_SUCCESS,
  GET_STAFF_LIST_ERROR,
  POST_STAFF_REQUEST,
  POST_STAFF_SUCCESS,
  POST_STAFF_ERROR,
  POST_PROMOTER_OUTLET_REQUEST,
  POST_PROMOTER_OUTLET_SUCCESS,
  POST_PROMOTER_OUTLET_ERROR,
  GET_ACTIVE_PROMOTERS_LIST_REQUEST,
  GET_ACTIVE_PROMOTERS_LIST_SUCCESS,
  GET_ACTIVE_PROMOTERS_LIST_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  pendingStaff: [],
  staffList: [],
  staff: {},
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getPendingSalesP: state => state.pendingStaff
};

const actions = {
  [PENDING_SALESP_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PENDING_SALESP_LIST_REQUEST);
      getPendingSalespList(postData)
        .then(resp => {
          commit(PENDING_SALESP_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PENDING_SALESP_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [PENDING_SALESP_STATUS_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PENDING_SALESP_STATUS_REQUEST);
      approveOrRejectSalesperson(postData)
        .then(resp => {
          commit(PENDING_SALESP_STATUS_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PENDING_SALESP_STATUS_ERROR, err);
          reject(err);
        });
    });
  },
  [GET_STAFF_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_STAFF_LIST_REQUEST);
      getStaffList(postData)
        .then(resp => {
          commit(GET_STAFF_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_STAFF_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [GET_ACTIVE_PROMOTERS_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_ACTIVE_PROMOTERS_LIST_REQUEST);
      getActivePromoters(postData)
        .then(resp => {
          commit(GET_ACTIVE_PROMOTERS_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_ACTIVE_PROMOTERS_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [POST_STAFF_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(POST_STAFF_REQUEST);
      addOrUpdateStaff(postData)
        .then(resp => {
          commit(POST_STAFF_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(POST_STAFF_ERROR, err);
          reject(err);
        });
    });
  },
  [POST_PROMOTER_OUTLET_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(POST_PROMOTER_OUTLET_REQUEST);
      addOrUpdatePromoterOutlet(postData)
        .then(resp => {
          commit(POST_PROMOTER_OUTLET_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(POST_PROMOTER_OUTLET_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  PENDING_SALESP_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PENDING_SALESP_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      pendingStaff: data,
      hasLoadedOnce: true
    });
  },
  PENDING_SALESP_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      products: [],
      hasLoadedOnce: true
    });
  },
  PENDING_SALESP_STATUS_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PENDING_SALESP_STATUS_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      pendingStaff: [],
      hasLoadedOnce: true
    });
  },
  PENDING_SALESP_STATUS_ERROR: state => {
    Object.assign(state, {
      status: "error",
      product: {},
      hasLoadedOnce: true
    });
  },
  GET_STAFF_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_STAFF_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      staffList: data,
      hasLoadedOnce: true
    });
  },
  GET_STAFF_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      staffList: [],
      hasLoadedOnce: true
    });
  },
  POST_STAFF_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  POST_STAFF_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      staff: data,
      hasLoadedOnce: true
    });
  },
  POST_STAFF_ERROR: state => {
    Object.assign(state, {
      status: "error",
      staff: {},
      hasLoadedOnce: true
    });
  },
  POST_PROMOTER_OUTLET_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  POST_PROMOTER_OUTLET_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      staff: data,
      hasLoadedOnce: true
    });
  },
  POST_PROMOTER_OUTLET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      staff: {},
      hasLoadedOnce: true
    });
  },
  GET_ACTIVE_PROMOTERS_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_ACTIVE_PROMOTERS_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  GET_ACTIVE_PROMOTERS_LIST_ERROR: state => {
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
