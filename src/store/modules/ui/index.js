import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR,
  NOTIFICATION_CLOSE
} from "./actions";

const state = {
  statusNotification: {
    message: "",
    type: "",
    indefinite: true,
    isLoading: false,
    show: false,
    timer: 5000
  }
};

const getters = {
  statusNotification: state => state.statusNotification
};

const actions = {
  [NOTIFICATION_REQUEST]: ({ commit }, postData) => {
    commit(NOTIFICATION_REQUEST, postData);
  },
  [NOTIFICATION_SUCCESS]: ({ commit }, postData) => {
    commit(NOTIFICATION_SUCCESS, postData);

    // setTimeout(() => commit(NOTIFICATION_CLOSE), 5000);
  },
  [NOTIFICATION_ERROR]: ({ commit }, postData) => {
    commit(NOTIFICATION_ERROR, postData);
    // setTimeout(() => commit(NOTIFICATION_CLOSE), 5000);
  },
  [NOTIFICATION_CLOSE]: ({ commit }) => {
    commit(NOTIFICATION_CLOSE);
  }
};

const mutations = {
  NOTIFICATION_REQUEST: (state, postData) => {
    state.statusNotification.show = true;
    state.statusNotification.isLoading = true;
    state.statusNotification.message = postData.message;
  },
  NOTIFICATION_SUCCESS: (state, postData) => {
    state.statusNotification.show = true;
    state.statusNotification.isLoading = false;
    state.statusNotification.indefinite = false;
    state.statusNotification.type = "is-success";
    state.statusNotification.message = postData.message;
    state.statusNotification.timer = 3000;
  },
  NOTIFICATION_ERROR: (state, postData) => {
    state.statusNotification.show = true;
    state.statusNotification.isLoading = false;
    state.statusNotification.indefinite = false;
    state.statusNotification.type = "is-danger";
    state.statusNotification.message = postData.message;
    state.statusNotification.timer = 3000;
  },
  NOTIFICATION_CLOSE: state => {
    state.statusNotification.show = false;
    state.statusNotification.indefinite = true;
    state.statusNotification.type = "";
    state.statusNotification.message = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
