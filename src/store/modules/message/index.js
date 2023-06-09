import {
  getMessagesTreadByUser,
  getMessagesTreadByCountry,
  sendMessage,
  getTreadMessageList,
  setMessageAsRead,
  getUnreadMessageCount
} from "@/api/message";
import {
  MESSAGE_USER_LIST_REQUEST,
  MESSAGE_USER_LIST_SUCCESS,
  MESSAGE_USER_LIST_ERROR,
  MESSAGE_POST_REQUEST,
  MESSAGE_POST_ERROR,
  MESSAGE_POST_SUCCESS,
  USER_MESSAGE_LIST_REQUEST,
  USER_MESSAGE_LIST_SUCCESS,
  USER_MESSAGE_LIST_ERROR,
  SET_READ_MESSAGE_REQUEST,
  SET_READ_MESSAGE_SUCCESS,
  SET_READ_MESSAGE_ERROR,
  GET_UNREAD_MESSAGE_COUNT_REQUEST,
  GET_UNREAD_MESSAGE_COUNT_SUCCESS,
  GET_UNREAD_MESSAGE_COUNT_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  users: [],
  messages: [],
  message: {},
  unreadCount: {},
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getMessageUsers: state => state.users,
  getMessages: state => state.messages,
  getMessage: state => state.message
};

const actions = {
  [MESSAGE_USER_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGE_USER_LIST_REQUEST);
      if (postData.type == "country") {
        getMessagesTreadByCountry(postData)
          .then(resp => {
            commit(MESSAGE_USER_LIST_SUCCESS, resp);
            resolve(resp);
          })
          .catch(err => {
            commit(MESSAGE_USER_LIST_ERROR, err);
            reject(err);
          });
      } else {
        getMessagesTreadByUser(postData)
          .then(resp => {
            commit(MESSAGE_USER_LIST_SUCCESS, resp);
            resolve(resp);
          })
          .catch(err => {
            commit(MESSAGE_USER_LIST_ERROR, err);
            reject(err);
          });
      }
    });
  },
  [MESSAGE_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGE_POST_REQUEST);
      sendMessage(postData)
        .then(resp => {
          commit(MESSAGE_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(MESSAGE_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [USER_MESSAGE_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(USER_MESSAGE_LIST_REQUEST);
      getTreadMessageList(postData)
        .then(resp => {
          commit(USER_MESSAGE_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(USER_MESSAGE_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [SET_READ_MESSAGE_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(SET_READ_MESSAGE_REQUEST);
      setMessageAsRead(postData)
        .then(resp => {
          commit(SET_READ_MESSAGE_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(SET_READ_MESSAGE_ERROR, err);
          reject(err);
        });
    });
  },
  [GET_UNREAD_MESSAGE_COUNT_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(GET_UNREAD_MESSAGE_COUNT_REQUEST);
      getUnreadMessageCount(postData)
        .then(resp => {
          commit(GET_UNREAD_MESSAGE_COUNT_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(GET_UNREAD_MESSAGE_COUNT_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  MESSAGE_USER_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  MESSAGE_USER_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      users: data,
      hasLoadedOnce: true
    });
  },
  MESSAGE_USER_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      users: [],
      hasLoadedOnce: true
    });
  },
  MESSAGE_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  MESSAGE_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      message: data,
      hasLoadedOnce: true
    });
  },
  MESSAGE_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      message: {},
      hasLoadedOnce: true
    });
  },
  USER_MESSAGE_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  USER_MESSAGE_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      messages: data,
      hasLoadedOnce: true
    });
  },
  USER_MESSAGE_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      messages: [],
      hasLoadedOnce: true
    });
  },
  SET_READ_MESSAGE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  SET_READ_MESSAGE_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      messages: data,
      hasLoadedOnce: true
    });
  },
  SET_READ_MESSAGE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      messages: [],
      hasLoadedOnce: true
    });
  },
  GET_UNREAD_MESSAGE_COUNT_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  GET_UNREAD_MESSAGE_COUNT_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      unreadCount: data,
      hasLoadedOnce: true
    });
  },
  GET_UNREAD_MESSAGE_COUNT_ERROR: state => {
    Object.assign(state, {
      status: "error",
      unreadCount: {},
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
