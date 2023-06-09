import {
  getDistributorList,
  getDistributorById,
  addOrUpdateDistributor
} from "@/api/distributor";
import {
  DISTRIBUTOR_LIST_REQUEST,
  DISTRIBUTOR_LIST_SUCCESS,
  DISTRIBUTOR_LIST_ERROR,
  DISTRIBUTOR_REQUEST,
  DISTRIBUTOR_SUCCESS,
  DISTRIBUTOR_ERROR,
  DISTRIBUTOR_POST_REQUEST,
  DISTRIBUTOR_POST_SUCCESS,
  DISTRIBUTOR_POST_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  distributor: {},
  distributors: [],
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getDistributor: state => state.distributor,
  getDistributors: state => state.distributors
};

const actions = {
  [DISTRIBUTOR_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DISTRIBUTOR_LIST_REQUEST);
      getDistributorList(postData)
        .then(resp => {
          commit(DISTRIBUTOR_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DISTRIBUTOR_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [DISTRIBUTOR_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DISTRIBUTOR_POST_REQUEST);
      addOrUpdateDistributor(postData)
        .then(resp => {
          commit(DISTRIBUTOR_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DISTRIBUTOR_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [DISTRIBUTOR_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DISTRIBUTOR_REQUEST);
      getDistributorById(postData)
        .then(resp => {
          commit(DISTRIBUTOR_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DISTRIBUTOR_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  DISTRIBUTOR_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DISTRIBUTOR_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      distributors: data,
      hasLoadedOnce: true
    });
  },
  DISTRIBUTOR_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      distributors: [],
      hasLoadedOnce: true
    });
  },
  DISTRIBUTOR_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DISTRIBUTOR_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      distributor: data,
      hasLoadedOnce: true
    });
  },
  DELAER_ERROR: state => {
    Object.assign(state, {
      status: "error",
      distributor: {},
      hasLoadedOnce: true
    });
  },
  DISTRIBUTOR_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DISTRIBUTOR_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      distributor: data,
      hasLoadedOnce: true
    });
  },
  DISTRIBUTOR_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      distributor: {},
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
