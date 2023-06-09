import { tableauLogin } from "@/api/tableau";
import {
  TABLEAU_LOGIN,
  TABLEAU_LOGIN_SUCCESS,
  TABLEAU_LOGIN_ERROR
} from "./actions";

const state = {
  tableauToken: localStorage.getItem("tableau-token") || "",
  status: "",
  hasLoadedOnce: false
};

const mutations = {
  TABLEAU_LOGIN: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  TABLEAU_LOGIN_SUCCESS: state => {
    Object.assign(state, {
      status: "",
      hasLoadedOnce: true
    });
  },
  TABLEAU_LOGIN_ERROR: state => {
    Object.assign(state, {
      status: "error",
      products: [],
      hasLoadedOnce: true
    });
  }
};

const actions = {
  [TABLEAU_LOGIN]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(TABLEAU_LOGIN);
      tableauLogin(postData)
        .then(resp => {
          commit(TABLEAU_LOGIN_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(TABLEAU_LOGIN_ERROR, err);
          reject(err);
        });
    });
  }
};

const getters = {
  tableauToken: state => state.tableauToken
};

export default {
  state,
  getters,
  actions,
  mutations
};
