import Vue from "vue";
import "../registerServiceWorker";
// eslint-disable-next-line no-unused-vars
import Metismenu from "metismenu";
import "../translations/ml";
import admin_layout from "../layouts/admin_layout.vue";
import auth_layout from "../layouts/auth_layout.vue";
import BootstrapVue from "bootstrap-vue";
import VueMoment from "vue-moment";
import moment from "moment-timezone";
import VeeValidate from "vee-validate";
import VueChatScroll from "vue-chat-scroll";
import Buefy from "buefy";
import JsonExcel from "vue-json-excel";
import VueQRCodeComponent from "vue-qrcode-component";
import Viewer from "v-viewer";
import * as VueGoogleMaps from "vue2-google-maps";
import vueXlsxTable from "vue-xlsx-table";
import VueProgressBar from "vue-progressbar";
import progressBarOptions from "./progressbar";
import statusNotification from "../components/ui/statusNotification.vue";

Vue.component("admin-layout", admin_layout);
Vue.component("auth-layout", auth_layout);

Vue.use(VueProgressBar, progressBarOptions);
Vue.component("status-notification", statusNotification);

window.$ = window.jQuery = require("jquery");
window.Vue = Vue;

Vue.use(BootstrapVue, VueMoment, {
  moment
});
Vue.use(Buefy);
Vue.component("downloadExcel", JsonExcel);
Vue.use(VueChatScroll);
Vue.component("qr-code", VueQRCodeComponent);

Vue.use(Viewer);

Vue.use(VueGoogleMaps, {
  load: {
    // Google API key
    key: process.env.VUE_APP_GOOGLE_MAP_API,
    // Enable more Google Maps libraries here
    libraries: ["places"],
    // Use new renderer
    useBetaRenderer: false
  }
});

Vue.use(vueXlsxTable, { rABS: false });

import Geocoder from "@pderas/vue2-geocoder";

Vue.use(Geocoder, {
  defaultCountryCode: null, // e.g. 'CA'
  defaultLanguage: null, // e.g. 'en'
  defaultMode: "address", // or 'lat-lng'
  googleMapsApiKey: process.env.VUE_APP_GOOGLE_MAP_API
});

const config = {
  aria: true,
  classNames: {},
  classes: false,
  delay: 0,
  dictionary: null,
  errorBagName: "errors", // change if property conflicts
  events: "input|blur",
  fieldsBagName: "fields",
  i18n: null, // the vue-i18n plugin instance
  i18nRootKey: "validations", // the nested key under which the validation messages will be located
  inject: true,
  locale: "en",
  validity: false,
  useConstraintAttrs: true
};
Vue.use(VeeValidate, config);
