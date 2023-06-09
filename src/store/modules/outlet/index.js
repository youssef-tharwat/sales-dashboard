import {
  getOutletPicList,
  getOutletPICById,
  addOrUpdateOutletPic,
  getOutletList,
  getOutletWithPICList,
  getOutletById,
  addOrUpdateOutlet,
  outletBulkUpload,
  getDealerOutletList
} from "@/api/outlet";
import {
  OUTLET_PIC_LIST_REQUEST,
  OUTLET_PIC_LIST_ERROR,
  OUTLET_PIC_LIST_SUCCESS,
  OUTLET_PIC_POST_REQUEST,
  OUTLET_PIC_POST_SUCCESS,
  OUTLET_PIC_POST_ERROR,
  OUTLET_PIC_REQUEST,
  OUTLET_PIC_SUCCESS,
  OUTLET_PIC_ERROR,
  OUTLET_LIST_REQUEST,
  OUTLET_LIST_ERROR,
  OUTLET_LIST_SUCCESS,
  OUTLET_POST_REQUEST,
  OUTLET_POST_SUCCESS,
  OUTLET_POST_ERROR,
  OUTLET_REQUEST,
  OUTLET_SUCCESS,
  OUTLET_ERROR,
  OUTLET_BULK_UPLOAD_REQUEST,
  OUTLET_BULK_UPLOAD_SUCCESS,
  OUTLET_BULK_UPLOAD_ERROR,
  OUTLET_WITH_PIC_LIST_REQUEST,
  OUTLET_WITH_PIC_LIST_SUCCESS,
  OUTLET_WITH_PIC_LIST_ERROR,
  DEALER_OUTLET_LIST_REQUEST,
  DEALER_OUTLET_LIST_SUCCESS,
  DEALER_OUTLET_LIST_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  outletpic: {},
  outletpics: [],
  outlet: {},
  outlets: [],
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getPicOutlet: state => state.outletpic,
  getPicOutlets: state => state.outletpics,
  getOutLets: state => state.outlets,
  getOutLet: state => state.outlet
};

const actions = {
  [OUTLET_PIC_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(OUTLET_PIC_LIST_REQUEST);
      getOutletPicList(postData)
        .then(resp => {
          commit(OUTLET_PIC_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(OUTLET_PIC_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [OUTLET_PIC_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(OUTLET_PIC_POST_REQUEST);
      addOrUpdateOutletPic(postData)
        .then(resp => {
          commit(OUTLET_PIC_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(OUTLET_PIC_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [OUTLET_PIC_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(OUTLET_PIC_REQUEST);
      getOutletPICById(postData)
        .then(resp => {
          commit(OUTLET_PIC_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(OUTLET_PIC_ERROR, err);
          reject(err);
        });
    });
  },
  [OUTLET_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(OUTLET_LIST_REQUEST);
      getOutletList(postData)
        .then(resp => {
          commit(OUTLET_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(OUTLET_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [OUTLET_WITH_PIC_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(OUTLET_WITH_PIC_LIST_REQUEST);
      getOutletWithPICList(postData)
        .then(resp => {
          commit(OUTLET_WITH_PIC_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(OUTLET_WITH_PIC_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [OUTLET_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(OUTLET_PIC_POST_REQUEST);
      addOrUpdateOutlet(postData)
        .then(resp => {
          commit(OUTLET_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(OUTLET_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [OUTLET_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(OUTLET_REQUEST);
      getOutletById(postData)
        .then(resp => {
          commit(OUTLET_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(OUTLET_ERROR, err);
          reject(err);
        });
    });
  },
  [OUTLET_BULK_UPLOAD_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(OUTLET_BULK_UPLOAD_REQUEST);
      outletBulkUpload(postData)
        .then(resp => {
          commit(OUTLET_BULK_UPLOAD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(OUTLET_BULK_UPLOAD_ERROR, err);
          reject(err);
        });
    });
  },
  [DEALER_OUTLET_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DEALER_OUTLET_LIST_REQUEST);
      getDealerOutletList(postData)
        .then(resp => {
          commit(DEALER_OUTLET_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DEALER_OUTLET_LIST_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  OUTLET_PIC_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  OUTLET_PIC_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      outletpics: data,
      hasLoadedOnce: true
    });
  },
  OUTLET_PIC_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      dealers: [],
      hasLoadedOnce: true
    });
  },
  OUTLET_PIC_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  OUTLET_PIC_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      outletpic: data,
      hasLoadedOnce: true
    });
  },
  OUTLET_PIC_ERROR: state => {
    Object.assign(state, {
      status: "error",
      outletpic: {},
      hasLoadedOnce: true
    });
  },
  OUTLET_PIC_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  OUTLET_PIC_POST_ERROR: (state, data) => {
    Object.assign(state, {
      state: "",
      outletpic: data,
      hasLoadedOnce: true
    });
  },
  OUTLET_PIC_POST_SUCCESS: state => {
    Object.assign(state, {
      status: "error",
      dealer: {},
      hasLoadedOnce: true
    });
  },
  OUTLET_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  OUTLET_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      outlets: data,
      hasLoadedOnce: true
    });
  },
  OUTLET_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      outlets: [],
      hasLoadedOnce: true
    });
  },
  OUTLET_WITH_PIC_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  OUTLET_WITH_PIC_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      outlets: data,
      hasLoadedOnce: true
    });
  },
  OUTLET_WITH_PIC_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      outlets: [],
      hasLoadedOnce: true
    });
  },
  OUTLET_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  OUTLET_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      outlet: data,
      hasLoadedOnce: true
    });
  },
  OUTLET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      outlet: {},
      hasLoadedOnce: true
    });
  },
  OUTLET_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  OUTLET_POST_ERROR: (state, data) => {
    Object.assign(state, {
      state: "",
      outlet: data,
      hasLoadedOnce: true
    });
  },
  OUTLET_POST_SUCCESS: state => {
    Object.assign(state, {
      status: "error",
      outlet: {},
      hasLoadedOnce: true
    });
  },
  OUTLET_BULK_UPLOAD_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  OUTLET_BULK_UPLOAD_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      outlet: data,
      hasLoadedOnce: true
    });
  },
  OUTLET_BULK_UPLOAD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      outlet: {},
      hasLoadedOnce: true
    });
  },
  DEALER_OUTLET_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_OUTLET_LIST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  DEALER_OUTLET_LIST_ERROR: state => {
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
