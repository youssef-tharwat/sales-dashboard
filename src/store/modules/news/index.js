import {
  getNewsList,
  getNewsById,
  deleteNewsById,
  addOrUpdateNews,
  uploadNewsImage
} from "@/api/news";
import {
  NEWS_LIST_REQUEST,
  NEWS_LIST_SUCCESS,
  NEWS_LIST_ERROR,
  NEWS_POST_REQUEST,
  NEWS_POST_SUCCESS,
  NEWS_POST_ERROR,
  NEWS_REQUEST,
  NEWS_SUCCESS,
  NEWS_ERROR,
  NEWS_DELETE_REQUEST,
  NEWS_DELETE_SUCCESS,
  NEWS_DELETE_ERROR,
  NEWS_IMAGE_UPLOAD_REQUEST,
  NEWS_IMAGE_UPLOAD_SUCCESS,
  NEWS_IMAGE_UPLOAD_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  singleNews: {},
  news: [],
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getSingleNews: state => state.singleNews,
  getNews: state => state.news
};

const actions = {
  [NEWS_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(NEWS_LIST_REQUEST);
      getNewsList(postData)
        .then(resp => {
          commit(NEWS_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(NEWS_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [NEWS_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(NEWS_POST_REQUEST);
      addOrUpdateNews(postData)
        .then(resp => {
          commit(NEWS_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(NEWS_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [NEWS_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(NEWS_REQUEST);
      getNewsById(postData)
        .then(resp => {
          commit(NEWS_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(NEWS_ERROR, err);
          reject(err);
        });
    });
  },
  [NEWS_DELETE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(NEWS_DELETE_REQUEST);
      deleteNewsById(postData)
        .then(resp => {
          commit(NEWS_DELETE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(NEWS_DELETE_ERROR, err);
          reject(err);
        });
    });
  },
  [NEWS_IMAGE_UPLOAD_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(NEWS_IMAGE_UPLOAD_REQUEST);
      uploadNewsImage(postData)
        .then(resp => {
          commit(NEWS_IMAGE_UPLOAD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(NEWS_IMAGE_UPLOAD_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  NEWS_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  NEWS_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      news: data,
      hasLoadedOnce: true
    });
  },
  NEWS_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      news: [],
      hasLoadedOnce: true
    });
  },
  NEWS_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  NEWS_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      singleNews: data,
      hasLoadedOnce: true
    });
  },
  NEWS_ERROR: state => {
    Object.assign(state, {
      status: "error",
      singleNews: {},
      hasLoadedOnce: true
    });
  },
  NEWS_DELETE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  NEWS_DELETE_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  NEWS_DELETE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  NEWS_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  NEWS_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      news: data,
      hasLoadedOnce: true
    });
  },
  NEWS_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      news: {},
      hasLoadedOnce: true
    });
  },
  NEWS_IMAGE_UPLOAD_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  NEWS_IMAGE_UPLOAD_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      news: data,
      hasLoadedOnce: true
    });
  },
  NEWS_IMAGE_UPLOAD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      news: {},
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
