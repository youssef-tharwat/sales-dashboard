import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import auth from "./modules/auth/index";
import dealer from "./modules/dealer/index";
import news from "./modules/news/index";
// import getters from './getters';
import outlet from "./modules/outlet/index";
import utility from "./modules/utility/index";
import product from "./modules/product/index";
import mtm from "./modules/mtm/index";
import staff from "./modules/staff/index";
import incentive from "./modules/incentive/index";
import message from "./modules/message/index";
import sales from "./modules/sales/index";
import target from "./modules/target/index";
import download from "./modules/download/index";
import distributor from "./modules/distributor/index";
import settings from "./modules/settings/index";
import ui from "./modules/ui/index";
import dashboard from "./modules/dashboard/index";
import tableau from "./modules/tableau/index";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const store = new Vuex.Store({
  modules: {
    dashboard,
    user,
    auth,
    dealer,
    news,
    outlet,
    product,
    mtm,
    staff,
    incentive,
    utility,
    message,
    sales,
    target,
    download,
    distributor,
    settings,
    ui,
    tableau
  },
  strict: debug
});

export default store;
