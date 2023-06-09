import {
  getCountryDataList,
  uploadTragetCountryData,
  getPromoterDataList,
  uploadTragetPromoterData,
  getPromoterLeaderDataList,
  uploadTragetPromoterLeaderData
} from "@/api/targets";
import {
  GET_COUNTRY_TARGET_DATA_LIST_REQUEST,
  GET_COUNTRY_TARGET_DATA_LIST_SUCCESS,
  GET_COUNTRY_TARGET_DATA_LIST_ERROR,
  UPLOAD_COUNTRY_TARGET_DATA_LIST_REQUEST,
  UPLOAD_COUNTRY_TARGET_DATA_LIST_SUCCESS,
  UPLOAD_COUNTRY_TARGET_DATA_LIST_ERROR,
  GET_PROMOTER_TARGET_DATA_LIST_REQUEST,
  GET_PROMOTER_TARGET_DATA_LIST_SUCCESS,
  GET_PROMOTER_TARGET_DATA_LIST_ERROR,
  UPLOAD_PROMOTER_TARGET_DATA_LIST_REQUEST,
  UPLOAD_PROMOTER_TARGET_DATA_LIST_SUCCESS,
  UPLOAD_PROMOTER_TARGET_DATA_LIST_ERROR,
  GET_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST,
  GET_PROMOTER_LEADER_TARGET_DATA_LIST_SUCCESS,
  GET_PROMOTER_LEADER_TARGET_DATA_LIST_ERROR,
  UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST,
  UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_SUCCESS,
  UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  data: [],
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getCountryData: state => state.data,
  getPromoterData: state => state.data
};

const actions = {
  [GET_COUNTRY_TARGET_DATA_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_COUNTRY_TARGET_DATA_LIST_REQUEST);
      getCountryDataList(postData)
        .then(resp => {
          commit(GET_COUNTRY_TARGET_DATA_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_COUNTRY_TARGET_DATA_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [UPLOAD_COUNTRY_TARGET_DATA_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(UPLOAD_COUNTRY_TARGET_DATA_LIST_REQUEST);
      uploadTragetCountryData(postData)
        .then(resp => {
          commit(UPLOAD_COUNTRY_TARGET_DATA_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(UPLOAD_COUNTRY_TARGET_DATA_LIST_ERROR);
          reject(err);
        });
    });
  },
  [GET_PROMOTER_TARGET_DATA_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_PROMOTER_TARGET_DATA_LIST_REQUEST);
      getPromoterDataList(postData)
        .then(resp => {
          commit(GET_PROMOTER_TARGET_DATA_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_PROMOTER_TARGET_DATA_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [UPLOAD_PROMOTER_TARGET_DATA_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(UPLOAD_PROMOTER_TARGET_DATA_LIST_REQUEST);
      uploadTragetPromoterData(postData)
        .then(resp => {
          commit(UPLOAD_PROMOTER_TARGET_DATA_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(UPLOAD_PROMOTER_TARGET_DATA_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [GET_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST);
      getPromoterLeaderDataList(postData)
        .then(resp => {
          commit(GET_PROMOTER_LEADER_TARGET_DATA_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_PROMOTER_LEADER_TARGET_DATA_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST);
      uploadTragetPromoterLeaderData(postData)
        .then(resp => {
          commit(UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  GET_COUNTRY_TARGET_DATA_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_COUNTRY_TARGET_DATA_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      data: data,
      hasLoadedOnce: true
    });
  },
  GET_COUNTRY_TARGET_DATA_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      data: [],
      hasLoadedOnce: true
    });
  },
  UPLOAD_COUNTRY_TARGET_DATA_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  UPLOAD_COUNTRY_TARGET_DATA_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      data: [],
      hasLoadedOnce: true
    });
  },
  UPLOAD_COUNTRY_TARGET_DATA_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      data: [],
      hasLoadedOnce: true
    });
  },
  GET_PROMOTER_TARGET_DATA_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_PROMOTER_TARGET_DATA_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      data: data,
      hasLoadedOnce: true
    });
  },
  GET_PROMOTER_TARGET_DATA_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      data: [],
      hasLoadedOnce: true
    });
  },
  UPLOAD_PROMOTER_TARGET_DATA_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  UPLOAD_PROMOTER_TARGET_DATA_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      data: data,
      hasLoadedOnce: true
    });
  },
  UPLOAD_PROMOTER_TARGET_DATA_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      data: [],
      hasLoadedOnce: true
    });
  },
  GET_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_PROMOTER_LEADER_TARGET_DATA_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      data: data,
      hasLoadedOnce: true
    });
  },
  GET_PROMOTER_LEADER_TARGET_DATA_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      data: [],
      hasLoadedOnce: true
    });
  },
  UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      data: data,
      hasLoadedOnce: true
    });
  },
  UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      data: [],
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
