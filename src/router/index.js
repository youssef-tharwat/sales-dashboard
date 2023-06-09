import Vue from "vue";
import Router from "vue-router";
import $ from "jquery";
import dashboardRouter from "./modules/dashboard";
import promoLeaderDashboard from "@/views/dashboard/promoter_leader.vue";
import DealerDashboard from "@/views/dashboard/dealer.vue";
import OutletDashboard from "@/views/dashboard/outlet.vue";
import RegionalPage from "@/views/dashboard/regional.vue";
import CountryPage from "@/views/dashboard/country.vue";
import DownloadSalesDataPage from "@/views/download/sales_data.vue";

import store from "../store";
import {
  ROLE_ADMIN,
  ROLE_COUNTRY_ADMIN,
  ROLE_GLN_COUNTRY_ADMIN,
  ROLE_PROMOTER_LEADER,
  ROLE_REGION_ADMIN,
  ROLE_DEALER,
  ROLE_CHECKER,
  LAYOUT_ADMIN,
  LAYOUT_AUTH,
  ROLE_OUTLET_PIC,
  ROLE_AGENCY,
  ROLE_COUNTRY_AGENCY,
  ROLE_REGION_MANAGER,
  ROLE_STATE_MANAGER
} from "../constants";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  jQueryInit();
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  jQueryInit();
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/signin");
};

function jQueryInit() {
  $(window).on("load", function() {
    $("#preloader").fadeOut(500);
    $("#main-wrapper").addClass("show");

    $("body").attr("data-sidebar-style") === "mini"
      ? $(".hamburger").addClass("is-active")
      : $(".hamburger").removeClass("is-active");
  });
}

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: store.getters.isPromoLeader
        ? promoLeaderDashboard
        : store.getters.isDealer
        ? DealerDashboard
        : store.getters.isPicOutlet
        ? OutletDashboard
        : store.getters.isAgency
        ? DownloadSalesDataPage
        : store.getters.isRegionAdmin
        ? RegionalPage
        : CountryPage,
      meta: {
        layout: LAYOUT_ADMIN,
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_DEALER,
          ROLE_PROMOTER_LEADER,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY,
          ROLE_REGION_MANAGER,
          ROLE_STATE_MANAGER
        ]
      },
      beforeEnter: ifAuthenticated
    },
    {
      path: "/not-allowed",
      component: () => import("../views/templs/per_denied.vue"),
      beforeEnter: ifAuthenticated,
      meta: {
        layout: LAYOUT_ADMIN,
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_DEALER,
          ROLE_PROMOTER_LEADER,
          ROLE_REGION_ADMIN,
          ROLE_CHECKER,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY,
          ROLE_REGION_MANAGER,
          ROLE_STATE_MANAGER
        ]
      }
    },
    {
      path: "/profile",
      component: () => import("../views/auth/profile.vue"),
      beforeEnter: ifAuthenticated,
      meta: {
        layout: LAYOUT_ADMIN,
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_DEALER,
          ROLE_PROMOTER_LEADER,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY,
          ROLE_REGION_MANAGER,
          ROLE_STATE_MANAGER
        ]
      }
    },
    {
      path: "/signin",
      component: () => import("../views/auth/signin.vue"),
      meta: {
        layout: LAYOUT_AUTH
      },
      beforeEnter: ifNotAuthenticated
    },
    {
      path: "/forgot-password",
      component: () => import("../views/auth/forgot-password.vue"),
      meta: {
        layout: LAYOUT_AUTH
      },
      beforeEnter: ifNotAuthenticated
    },
    dashboardRouter,
    {
      path: "*",
      redirect: "/",
      hidden: true,
      meta: {
        layout: LAYOUT_ADMIN,
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_DEALER,
          ROLE_PROMOTER_LEADER,
          ROLE_REGION_ADMIN,
          ROLE_CHECKER,
          ROLE_OUTLET_PIC,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY,
          ROLE_REGION_MANAGER,
          ROLE_STATE_MANAGER
        ]
      },
      beforeEnter: ifAuthenticated
    }
  ]
});
