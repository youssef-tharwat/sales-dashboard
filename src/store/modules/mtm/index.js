import { getExclusiveMTM, updateExclusiceMTM } from "@/api/mtm.js";
import {
  EXCLUSIVE_MTM_POST_REQUEST,
  EXCLUSIVE_MTM_POST_SUCCESS,
  EXCLUSIVE_MTM_POST_ERROR,
  EXCLUSIVE_MTM_UPLOAD_REQUEST,
  EXCLUSIVE_MTM_UPLOAD_SUCCESS,
  EXCLUSIVE_MTM_UPLOAD_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  mtm: [],
  status: "",
  hasLoadedOnce: false
};

const getters = {};

const actions = {
  [EXCLUSIVE_MTM_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(EXCLUSIVE_MTM_POST_REQUEST);
      getExclusiveMTM(postData)
        .then(resp => {
          commit(EXCLUSIVE_MTM_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(EXCLUSIVE_MTM_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [EXCLUSIVE_MTM_UPLOAD_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(EXCLUSIVE_MTM_UPLOAD_REQUEST);
      updateExclusiceMTM(postData)
        .then(resp => {
          commit(EXCLUSIVE_MTM_UPLOAD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(EXCLUSIVE_MTM_UPLOAD_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  EXCLUSIVE_MTM_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  EXCLUSIVE_MTM_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      mtm: data,
      hasLoadedOnce: true
    });
  },
  EXCLUSIVE_MTM_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      mtm: [],
      hasLoadedOnce: true
    });
  },
  EXCLUSIVE_MTM_UPLOAD_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  EXCLUSIVE_MTM_UPLOAD_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      mtm: data,
      hasLoadedOnce: true
    });
  },
  EXCLUSIVE_MTM_UPLOAD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      mtm: [],
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
