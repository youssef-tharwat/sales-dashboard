import app from "../main";
import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { API_URL } from "@/constants";

import { NOTIFICATION_ERROR } from "../store/modules/ui/actions";
// eslint-disable-next-line no-unused-vars
import $ from "jquery";
// create an axios instance
const service = axios.create({
  baseURL: API_URL
  // timeout: 30000 // request timeout,
});

// let isLoading = false;

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// request interceptor
service.interceptors.request.use(
  serviceConfig => {
    app.$Progress.start();

    // isLoading = true;
    serviceConfig.headers.common["Accept"] =
      "application/vnd.globalline.lrcm-v1+json";
    serviceConfig.headers.common["Content-Type"] = "application/json";
    // serviceConfig.headers.common["X-Requested-With"] = "XMLHttpRequest";
    // serviceConfig.headers.common['Access-Control-Allow-Origin'] = '*';
    // serviceConfig.headers.common['Access-Control-Allow-Credentials'] = true;
    // serviceConfig.headers.common['crossorigin'] = true;
    // serviceConfig.headers.common['credentials'] = 'same-origin';
    // serviceConfig.headers.common['mode'] = 'no-cors';

    let token = localStorage.getItem("user-token");
    let tableauToken = localStorage.getItem("tableau-token");
    if (token) {
      serviceConfig.headers.common["Authorization"] = "Bearer " + token;
      if (tableauToken) {
        serviceConfig.headers.common["X-Tableau-Auth"] = tableauToken;
      } else {
        delete axios.defaults.headers.common["X-Tableau-Auth"];
      }
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    return serviceConfig;
  },
  error => {
    app.$Progress.fail();
    Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response;
    if (res.status === 200 && res.data.resultCode === 0) {
      // app.$Progress.finish();
      return res.data;
    } else if (res.status !== 200) {
      // app.$Progress.finish();
      // store.dispatch(NOTIFICATION_CLOSE, {
      //   message: res.message
      // });
      store.dispatch(NOTIFICATION_ERROR, {
        message: res.message
      });
      Message({
        message: res.message,
        type: "error",
        duration: 5 * 1000
      });
      return res.data;
    } else if (res.data.resultCode === -8) {
      // app.$Progress.finish();
      // store.dispatch(NOTIFICATION_CLOSE, {
      //   message: res.message
      // });
      store.dispatch(NOTIFICATION_ERROR, {
        message: res.data.content.message
      });
      // Message({
      //   message: res.data.content.message,
      //   type: "error",
      //   duration: 5 * 1000
      // });

      // setTimeout(function () {
      //   localStorage.removeItem('user-token');
      //   localStorage.removeItem('user');
      //   location.replace("/signin");
      // }, 2000);

      return res.data;
    } else if (res.data.resultCode <= -1) {
      // app.$Progress.finish();
      // store.dispatch(NOTIFICATION_CLOSE, {
      //   message: res.message
      // });
      store.dispatch(NOTIFICATION_ERROR, {
        message: res.data.content.message
      });
      return res.data;
    }
    app.$Progress.finish();
  },
  error => {
    // document.body.classList.remove("loading-indicator");
    // $("#preloader").fadeOut(500);
    app.$Progress.fail();
    // store.dispatch(NOTIFICATION_CLOSE, {
    //   message: res.message
    // });
    store.dispatch(NOTIFICATION_ERROR, {
      message: error.message
    });
    // return Message({
    //   message: error.message,
    //   type: "error",
    //   duration: 5 * 1000
    // });
    // return Promise.resolve(error);
  }
);

export default service;
