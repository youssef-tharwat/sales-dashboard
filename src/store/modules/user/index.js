import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from "./actions";
import Vue from "vue";
import { AUTH_LOGOUT } from "../auth/actions";

import { getUserInfo } from "@/api/user";

const state = {
  status: "",
  profile: JSON.parse(localStorage.getItem("user")) || {}
};

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.first_name
};

const actions = {
  [USER_REQUEST]: ({ commit, dispatch }) => {
    commit(USER_REQUEST);
    getUserInfo()
      .then(resp => {
        commit(USER_SUCCESS, resp);
      })
      .catch(err => {
        commit(USER_ERROR);

        // if resp is unauthorized, logout, to
        dispatch(AUTH_LOGOUT);
        console.log(err);
      });
  }
};

const mutations = {
  USER_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  USER_SUCCESS: (state, resp) => {
    Object.assign(state, {
      status: "",
      profile: resp.data
    });
    // console.log(resp.data);
    // alert(resp.data.first_name);
    Vue.set(state, "profile", resp.data);
  },
  USER_ERROR: state => {
    Object.assign(state, {
      status: "error"
    });
  },
  AUTH_LOGOUT: state => {
    Object.assign(state, {
      profile: {}
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
