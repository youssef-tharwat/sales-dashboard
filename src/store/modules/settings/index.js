import { getMobileSettings, updateMobileAppSettings } from "@/api/lnv";
import {
  MOBILE_APP_SETTINGS_REQUEST,
  MOBILE_APP_SETTINGS_SUCCESS,
  MOBILE_APP_SETTINGS_ERROR,
  MOBILE_APP_SETTINGS_POST_REQUEST,
  MOBILE_APP_SETTINGS_POST_SUCCESS,
  MOBILE_APP_SETTINGS_POST_ERROR
} from "./actions";

const state = {
  settings: {},
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getSettings: state => state.settings
};

const actions = {
  [MOBILE_APP_SETTINGS_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(MOBILE_APP_SETTINGS_REQUEST);
      getMobileSettings(postData)
        .then(resp => {
          commit(MOBILE_APP_SETTINGS_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(MOBILE_APP_SETTINGS_ERROR, err);
          reject(err);
        });
    });
  },
  [MOBILE_APP_SETTINGS_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(MOBILE_APP_SETTINGS_POST_REQUEST);
      updateMobileAppSettings(postData)
        .then(resp => {
          commit(MOBILE_APP_SETTINGS_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(MOBILE_APP_SETTINGS_POST_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  MOBILE_APP_SETTINGS_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  MOBILE_APP_SETTINGS_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      settings: data,
      hasLoadedOnce: true
    });
  },
  MOBILE_APP_SETTINGS_ERROR: state => {
    Object.assign(state, {
      status: "error",
      products: [],
      hasLoadedOnce: true
    });
  },
  MOBILE_APP_SETTINGS_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  MOBILE_APP_SETTINGS_POST_SUCCESS: state => {
    Object.assign(state, {
      status: "",
      hasLoadedOnce: true
    });
  },
  MOBILE_APP_SETTINGS_POST_ERROR: state => {
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
