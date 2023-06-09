import {
  topRowDataGet,
  getRegionalDashboard,
  topFiltersGet,
  productFiltersGet,
  componentFiltersGet,
  getCdTopFilters,
  getCdProductFilters,
  getCdComponentFilters,
  getCountryDashboard
} from "@/api/dashboard";
import {
  DASHBOARD_TOP_ROW_DATA_GET,
  DASHBOARD_TOP_ROW_DATA_GET_SUCCESS,
  DASHBOARD_TOP_ROW_DATA_GET_ERROR,
  DASHBOARD_TOP_FILTERS_GET,
  DASHBOARD_TOP_FILTERS_GET_SUCCESS,
  DASHBOARD_TOP_FILTERS_GET_ERROR,
  DASHBOARD_PRODUCT_FILTERS_GET,
  DASHBOARD_PRODUCT_FILTERS_GET_SUCCESS,
  DASHBOARD_PRODUCT_FILTERS_GET_ERROR,
  DASHBOARD_COMPONENT_FILTERS_GET,
  DASHBOARD_COMPONENT_FILTERS_GET_SUCCESS,
  DASHBOARD_COMPONENT_FILTERS_GET_ERROR,
  REGIONAL_DASHBOARD_DATA_GET,
  REGIONAL_DASHBOARD_DATA_GET_SUCCESS,
  REGIONAL_DASHBOARD_DATA_GET_ERROR,
  CDASHBOARD_TOP_FILTERS_GET,
  CDASHBOARD_TOP_FILTERS_GET_SUCCESS,
  CDASHBOARD_TOP_FILTERS_GET_ERROR,
  CDASHBOARD_PRODUCT_FILTERS_GET,
  CDASHBOARD_PRODUCT_FILTERS_GET_SUCCESS,
  CDASHBOARD_PRODUCT_FILTERS_GET_ERROR,
  CDASHBOARD_COMPONENT_FILTERS_GET,
  CDASHBOARD_COMPONENT_FILTERS_GET_SUCCESS,
  CDASHBOARD_COMPONENT_FILTERS_GET_ERROR,
  CDASHBOARD_DATA_GET,
  CDASHBOARD_DATA_GET_SUCCESS,
  CDASHBOARD_DATA_GET_ERROR
} from "./actions";

const state = {
  topRowData: [],
  topFilers: [],
  topFilterCountry: {
    name: "CAP",
    value: "CAP"
  },
  status: "",
  hasLoadedOnce: false,
  dashboardData: {}
};

const mutations = {
  DASHBOARD_TOP_ROW_DATA_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DASHBOARD_TOP_ROW_DATA_GET_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      topRowData: data,
      hasLoadedOnce: true
    });
  },
  DASHBOARD_TOP_ROW_DATA_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      topRowData: [],
      hasLoadedOnce: true
    });
  },
  REGIONAL_DASHBOARD_DATA_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  REGIONAL_DASHBOARD_DATA_GET_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      dashboardData: data,
      hasLoadedOnce: true
    });
  },
  REGIONAL_DASHBOARD_DATA_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DASHBOARD_TOP_FILTERS_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DASHBOARD_TOP_FILTERS_GET_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      topFilers: data,
      hasLoadedOnce: true
    });
  },
  DASHBOARD_TOP_FILTERS_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DASHBOARD_PRODUCT_FILTERS_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DASHBOARD_PRODUCT_FILTERS_GET_SUCCESS: state => {
    Object.assign(state, {
      status: "",
      hasLoadedOnce: true
    });
  },
  DASHBOARD_PRODUCT_FILTERS_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DASHBOARD_COMPONENT_FILTERS_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  DASHBOARD_COMPONENT_FILTERS_GET_SUCCESS: state => {
    Object.assign(state, {
      status: "",
      hasLoadedOnce: true
    });
  },
  DASHBOARD_COMPONENT_FILTERS_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  DASHBOARD_COUNTRY_FILTER_SET: (state, data) => {
    Object.assign(state, {
      status: "",
      topFilterCountry: data,
      hasLoadedOnce: true
    });
  },
  CDASHBOARD_TOP_FILTERS_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  CDASHBOARD_TOP_FILTERS_GET_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      topFilers: data,
      hasLoadedOnce: true
    });
  },
  CDASHBOARD_TOP_FILTERS_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  CDASHBOARD_PRODUCT_FILTERS_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  CDASHBOARD_PRODUCT_FILTERS_GET_SUCCESS: state => {
    Object.assign(state, {
      status: "",
      hasLoadedOnce: true
    });
  },
  CDASHBOARD_PRODUCT_FILTERS_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  CDASHBOARD_COMPONENT_FILTERS_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  CDASHBOARD_COMPONENT_FILTERS_GET_SUCCESS: state => {
    Object.assign(state, {
      status: "",
      hasLoadedOnce: true
    });
  },
  CDASHBOARD_COMPONENT_FILTERS_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  },
  CDASHBOARD_DATA_GET: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  CDASHBOARD_DATA_GET_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      dashboardData: data,
      hasLoadedOnce: true
    });
  },
  CDASHBOARD_DATA_GET_ERROR: state => {
    Object.assign(state, {
      status: "error",
      hasLoadedOnce: true
    });
  }
};

const actions = {
  [DASHBOARD_TOP_ROW_DATA_GET]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DASHBOARD_TOP_ROW_DATA_GET);
      topRowDataGet(postData)
        .then(resp => {
          commit(DASHBOARD_TOP_ROW_DATA_GET_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DASHBOARD_TOP_ROW_DATA_GET_ERROR, err);
          reject(err);
        });
    });
  },
  [REGIONAL_DASHBOARD_DATA_GET]: ({ commit, dispatch }, postData) => {
    return new Promise((resolve, reject) => {
      commit(REGIONAL_DASHBOARD_DATA_GET);
      getRegionalDashboard(postData)
        .then(resp => {
          dispatch("dashboardDataFormatting", resp.content).then(res => {
            resolve(res);
          });
        })
        .catch(err => {
          commit(REGIONAL_DASHBOARD_DATA_GET_ERROR, err);
          reject(err);
        });
    });
  },
  dashboardDataFormatting: async ({ commit }, postData) => {
    const localDashboardData = {};
    await postData.charts.forEach(element => {
      localDashboardData[
        element.chartName
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, "")
      ] = {
        name: element.chartName,
        data: [element.series].concat(element.data),
        customLegend: element.customLegend ? element.customLegend : null
      };
    });
    localDashboardData["topRowData"] = postData.topRowData[0];
    localDashboardData["heatMapTableData"] = postData.extras
      ? postData.extras[0].heatmapDataEntries
      : [];
    return commit(REGIONAL_DASHBOARD_DATA_GET_SUCCESS, localDashboardData);
  },
  [DASHBOARD_TOP_FILTERS_GET]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DASHBOARD_TOP_FILTERS_GET);
      topFiltersGet(postData)
        .then(resp => {
          commit(DASHBOARD_TOP_FILTERS_GET_SUCCESS, resp.content);
          resolve(resp);
        })
        .catch(err => {
          commit(DASHBOARD_TOP_FILTERS_GET_ERROR, err);
          reject(err);
        });
    });
  },
  [DASHBOARD_PRODUCT_FILTERS_GET]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DASHBOARD_PRODUCT_FILTERS_GET);
      productFiltersGet(postData)
        .then(resp => {
          commit(DASHBOARD_PRODUCT_FILTERS_GET_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DASHBOARD_PRODUCT_FILTERS_GET_ERROR, err);
          reject(err);
        });
    });
  },
  [DASHBOARD_COMPONENT_FILTERS_GET]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(DASHBOARD_COMPONENT_FILTERS_GET);
      componentFiltersGet(postData)
        .then(resp => {
          commit(DASHBOARD_COMPONENT_FILTERS_GET_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DASHBOARD_COMPONENT_FILTERS_GET_ERROR, err);
          reject(err);
        });
    });
  },
  [CDASHBOARD_TOP_FILTERS_GET]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(CDASHBOARD_TOP_FILTERS_GET);
      getCdTopFilters(postData)
        .then(resp => {
          commit(CDASHBOARD_TOP_FILTERS_GET_SUCCESS, resp.content);
          resolve(resp);
        })
        .catch(err => {
          commit(CDASHBOARD_TOP_FILTERS_GET_ERROR, err);
          reject(err);
        });
    });
  },
  [CDASHBOARD_PRODUCT_FILTERS_GET]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(CDASHBOARD_PRODUCT_FILTERS_GET);
      getCdProductFilters(postData)
        .then(resp => {
          commit(CDASHBOARD_PRODUCT_FILTERS_GET_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(CDASHBOARD_PRODUCT_FILTERS_GET_ERROR, err);
          reject(err);
        });
    });
  },
  [CDASHBOARD_COMPONENT_FILTERS_GET]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(CDASHBOARD_COMPONENT_FILTERS_GET);
      getCdComponentFilters(postData)
        .then(resp => {
          commit(CDASHBOARD_COMPONENT_FILTERS_GET_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(CDASHBOARD_COMPONENT_FILTERS_GET_ERROR, err);
          reject(err);
        });
    });
  },
  [CDASHBOARD_DATA_GET]: ({ commit, dispatch }, postData) => {
    return new Promise((resolve, reject) => {
      commit(CDASHBOARD_DATA_GET);
      getCountryDashboard(postData)
        .then(resp => {
          dispatch("dashboardCountryDataFormatting", resp.content).then(res => {
            resolve(res);
          });
        })
        .catch(err => {
          commit(CDASHBOARD_DATA_GET_ERROR, err);
          reject(err);
        });
    });
  },
  dashboardCountryDataFormatting: async ({ commit }, postData) => {
    const localDashboardData = {};
    await postData.charts.forEach(element => {
      localDashboardData[
        element.chartName
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, "")
      ] = {
        name: element.chartName,
        data: [element.series].concat(element.data),
        customLegend: element.customLegend ? element.customLegend : null
      };
    });
    localDashboardData["topRowData"] = postData.topRowData[0];
    return commit(CDASHBOARD_DATA_GET_SUCCESS, localDashboardData);
  }
};

const getters = {
  getTopRowData: state => state.topRowData,
  dashboardData: state => state.dashboardData,
  topFiltersData: state => state.topFilers,
  topFilterCountryData: state => state.topFilterCountry
};

export default {
  state,
  getters,
  actions,
  mutations
};
