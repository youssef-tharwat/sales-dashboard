import Vue from "vue";
import { MLInstaller, MLCreate, MLanguage } from "vue-multilanguage";
import en from "./langs/en.json";
import my from "./langs/my.json";

Vue.use(MLInstaller);

export default new MLCreate({
  initial: "english",
  save: process.env.NODE_ENV === "production",
  languages: [
    new MLanguage("english").create(en),
    new MLanguage("malay").create(my)
  ]
});
