import {
  getProductList,
  getProductById,
  addOrUpdateProduct,
  getProductSkuList,
  uploadProductGuide,
  productBulkUpload
} from "@/api/product";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_ERROR,
  PRODUCT_POST_REQUEST,
  PRODUCT_POST_SUCCESS,
  PRODUCT_POST_ERROR,
  PRODUCT_REQUEST,
  PRODUCT_SUCCESS,
  PRODUCT_ERROR,
  PRODUCT_SKU_LIST_REQUEST,
  PRODUCT_SKU_LIST_SUCCESS,
  PRODUCT_SKU_LIST_ERROR,
  PRODUCT_GUILD_UPLOAD_REQUEST,
  PRODUCT_GUILD_UPLOAD_SUCCESS,
  PRODUCT_GUILD_UPLOAD_ERROR,
  PRODUCT_BULK_POST_REQUEST,
  PRODUCT_BULK_POST_SUCCESS,
  PRODUCT_BULK_POST_ERROR
} from "./actions";

const state = {
  token: localStorage.getItem("user-token") || "",
  product: {},
  products: [],
  productSkus: [],
  status: "",
  hasLoadedOnce: false
};

const getters = {
  getProduct: state => state.product,
  getProducts: state => state.products
};

const actions = {
  [PRODUCT_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_LIST_REQUEST);
      getProductList(postData)
        .then(resp => {
          commit(PRODUCT_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_LIST_ERROR, err);
          reject(err);
        });
    });
  },
  [PRODUCT_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_REQUEST);
      getProductById(postData)
        .then(resp => {
          commit(PRODUCT_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_ERROR, err);
          reject(err);
        });
    });
  },
  [PRODUCT_GUILD_UPLOAD_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_GUILD_UPLOAD_REQUEST);
      uploadProductGuide(postData)
        .then(resp => {
          commit(PRODUCT_GUILD_UPLOAD_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_GUILD_UPLOAD_ERROR, err);
          reject(err);
        });
    });
  },
  [PRODUCT_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_POST_REQUEST);
      addOrUpdateProduct(postData)
        .then(resp => {
          commit(PRODUCT_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [PRODUCT_BULK_POST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_BULK_POST_REQUEST);
      productBulkUpload(postData)
        .then(resp => {
          commit(PRODUCT_BULK_POST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_BULK_POST_ERROR, err);
          reject(err);
        });
    });
  },
  [PRODUCT_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_REQUEST);
      getProductById(postData)
        .then(resp => {
          commit(PRODUCT_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_ERROR, err);
          reject(err);
        });
    });
  },
  [PRODUCT_SKU_LIST_REQUEST]: ({ commit }, postData) => {
    return new Promise((resolve, reject) => {
      commit(PRODUCT_SKU_LIST_REQUEST);
      getProductSkuList(postData)
        .then(resp => {
          commit(PRODUCT_SKU_LIST_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(PRODUCT_SKU_LIST_ERROR, err);
          reject(err);
        });
    });
  }
};

const mutations = {
  PRODUCT_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PRODUCT_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      products: data,
      hasLoadedOnce: true
    });
  },
  PRODUCT_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      products: [],
      hasLoadedOnce: true
    });
  },
  PRODUCT_SKU_LIST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PRODUCT_SKU_LIST_SUCCESS: (state, data) => {
    Object.assign(state, {
      status: "",
      productSkus: data,
      hasLoadedOnce: true
    });
  },
  PRODUCT_SKU_LIST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      products: [],
      hasLoadedOnce: true
    });
  },
  PRODUCT_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PRODUCT_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      product: data,
      hasLoadedOnce: true
    });
  },
  PRODUCT_ERROR: state => {
    Object.assign(state, {
      status: "error",
      product: {},
      hasLoadedOnce: true
    });
  },
  PRODUCT_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PRODUCT_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      product: data,
      hasLoadedOnce: true
    });
  },
  PRODUCT_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      product: {},
      hasLoadedOnce: true
    });
  },
  PRODUCT_BULK_POST_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PRODUCT_BULK_POST_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      product: data,
      hasLoadedOnce: true
    });
  },
  PRODUCT_BULK_POST_ERROR: state => {
    Object.assign(state, {
      status: "error",
      product: {},
      hasLoadedOnce: true
    });
  },
  PRODUCT_GUILD_UPLOAD_REQUEST: state => {
    Object.assign(state, {
      status: "loading"
    });
  },
  PRODUCT_GUILD_UPLOAD_SUCCESS: (state, data) => {
    Object.assign(state, {
      state: "",
      product: data,
      hasLoadedOnce: true
    });
  },
  PRODUCT_GUILD_UPLOAD_ERROR: state => {
    Object.assign(state, {
      status: "error",
      product: {},
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
