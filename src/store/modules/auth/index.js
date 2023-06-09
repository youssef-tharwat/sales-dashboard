import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_ERROR,
  PROFILE_POST_REQUEST,
  PROFILE_POST_SUCCESS,
  PROFILE_POST_ERROR,
  PASSWORD_POST_REQUEST,
  PASSWORD_POST_SUCCESS,
  PASSWORD_POST_ERROR,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_ERROR
} from "./actions";
import {
  loginByUsername,
  getUserProfile,
  resetByEmail,
  updateProfile,
  updatePassword
} from "@/api/auth";

let userData = JSON.parse(localStorage.getItem("user")) || {};
let countryId = 0;
let countryCode = "";
let userRole = "";
let userId = 0;
if (userData) {
  countryId = userData.user ? userData.user.createdCountryId : 0;
  userRole = userData.countryRoleList ? userData.countryRoleList[0]["role"] : userData.role;
  userId = userData.user ? userData.user.id : 0;
  countryCode = userData.country ? userData.country : "MY";
}

const state = {
  token: localStorage.getItem("user-token") || "",
  user: userData,
  status: "",
  hasLoadedOnce: false,
  getCountryId: countryId,
  getCountryCode: countryCode,
  getUserRole: userRole,
  getUserId: userId,
  isAdmin: userRole === "Admin",
  isCountryAdmin: userRole === "Country_Head",
  isGLNCountryAdmin: userRole === "GLN_Country_Head",
  isRegionAdmin: userRole === "Regional",
  isDealer: userRole === "Dealer",
  isPromoLeader: userRole === "Promoter_Leader",
  isPicOutlet: userRole === "Outlet_PIC",
  isAgency: userRole === "Agency",
  isCountryAgency: userRole === "Country_Agency",
  isStateManager: userRole === "State_Manager",
  isRegionManager: userRole === "Regional_Manager"
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  getUser: state => state.auth,
  user: state => state.user,
  getCountryId: state => state.getCountryId,
  getCountryCode: state => state.getCountryCode,
  getUserRole: state => state.getUserRole,
  getUserId: state => state.getUserId,
  isAdmin: state => state.isAdmin,
  isCountryAdmin: state => state.isCountryAdmin,
  isGLNCountryAdmin: state => state.isGLNCountryAdmin,
  isRegionAdmin: state => state.isRegionAdmin,
  isDealer: state => state.isDealer,
  isPromoLeader: state => state.isPromoLeader,
  isPicOutlet: state => state.isPicOutlet,
  isAgency: state => state.isAgency,
  isCountryAgency: state => state.isCountryAgency,
  isStateManager: state => state.isStateManager,
  isRegionManager: state => state.isRegionManager
};

const actions = {
  [AUTH_REQUEST]: ({ commit }, authData) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      loginByUsername(authData)
        .then(resp => {
          if (resp) {
            // alert(JSON.stringify(resp));
            let ad = resp.content;
            if (ad.accessToken) {
              localStorage.setItem("user-token", ad.accessToken);
              let user = {
                profilePic:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIp5rxGw-RDahWMjll8IdthIiY-H21h3UyNl8KMDPDTlUNa0lH"
              };
              localStorage.setItem("user", JSON.stringify(user));
              // dispatch(PROFILE_REQUEST)
              commit(AUTH_SUCCESS, resp);
              resolve(resp);
            } else {
              commit(AUTH_ERROR, resp);
              localStorage.removeItem("user-token");
              localStorage.removeItem("user");
              reject(resp);
            }
            resolve(resp);
          } else {
            // reject({})
          }
        })
        .catch(err => {
          commit(AUTH_ERROR, err);
          localStorage.removeItem("user-token");
          localStorage.removeItem("user");
          reject(err);
        });
    });
  },
  [PROFILE_REQUEST]: ({ commit }, authData) => {
    return new Promise((resolve, reject) => {
      commit(PROFILE_REQUEST);
      getUserProfile(authData)
        .then(resp => {
          let profile = resp.content;
          if (profile) {
            if (profile.userProfile) {
              let user = {
                name: profile.userProfile.displayName,
                countryRoleList: profile.countryRoleList,
                role: profile.countryRoleList[0].role,
                user: profile.userProfile,
                country: profile.countryCode,
                profilePic:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIp5rxGw-RDahWMjll8IdthIiY-H21h3UyNl8KMDPDTlUNa0lH"
              };

              if (user.role == "Dealer" && profile.canBulkUpload) {
                user.canBulkUpload = profile.canBulkUpload;
              }

              localStorage.setItem("user", JSON.stringify(user));
              commit(PROFILE_SUCCESS, user);
              resolve(resp);
            } else {
              localStorage.removeItem("user-token");
              localStorage.removeItem("user");
              reject(resp);
            }
          } else {
            commit(PROFILE_ERROR, resp);
            localStorage.removeItem("user");
            reject(resp);
          }

          resolve(resp);
        })
        .catch(err => {
          commit(PROFILE_ERROR, err);
          localStorage.removeItem("user");
          reject(err);
        });
    });
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise(resolve => {
      commit(AUTH_LOGOUT);
      localStorage.removeItem("user-token");
      localStorage.removeItem("user");
      resolve({
        logout: true
      });
    });
  },
  [PROFILE_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PROFILE_POST_REQUEST);
      updateProfile(postData)
        .then(resp => {
          commit(PROFILE_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PROFILE_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [PASSWORD_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PASSWORD_POST_REQUEST);
      updatePassword(postData)
        .then(resp => {
          commit(PASSWORD_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PASSWORD_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [PASSWORD_RESET_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PASSWORD_RESET_REQUEST);
      resetByEmail(postData)
        .then(resp => {
          commit(PASSWORD_RESET_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PASSWORD_RESET_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  AUTH_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  AUTH_SUCCESS: (state, token) => {
    Object.assign(state, {
      status: "",
      token: token,
      hasLoadedOnce: true
    });
  },
  AUTH_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  PROFILE_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PROFILE_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      user: data,
      hasLoadedOnce: true
    });
  },
  PROFILE_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  AUTH_LOGOUT: state => {
    Object.assign(state, {
      status: "loading",
      hasLoadedOnce: true
    });
  },
  SET_USER_TOKEN: (state, token) => {
    Object.assign(state, {
      token
    });
  },
  DEALER_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DEALER_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      dealer: data,
      hasLoadedOnce: true
    });
  },
  DEALER_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      dealer: {},
      hasLoadedOnce: true
    });
  },
  PROFILE_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PROFILE_POST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  PROFILE_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  PASSWORD_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PASSWORD_POST_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  PASSWORD_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  PASSWORD_RESET_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PASSWORD_RESET_SUCCESS: state => {
    Object.assign(state, {
      state: "",
      hasLoadedOnce: true
    });
  },
  PASSWORD_RESET_ERROR: state => {
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
