let userData = JSON.parse(localStorage.getItem("user"));
let countryId = 0;
if (userData) {
  countryId = userData.user.createdCountryId;
}

export const state = {
  authToken: localStorage.getItem("user-token") || "",
  status: "",
  hasLoadedOnce: false,
  countryId: countryId
};

const getters = {
  isAuthenticated: state => !!state.authToken,
  authStatus: state => state.status,
  getCountryId: state => state.countryId
};
export default getters;
