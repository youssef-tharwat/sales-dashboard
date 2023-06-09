import axios from "axios";
import { API_TABLEAU_LOGIN_SERVICE } from "../constants/services";

export function tableauLogin(postData) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  };
  let form_data = new FormData();

  for (var key in postData) {
    form_data.append(key, postData[key]);
  }
  return axios.post(API_TABLEAU_LOGIN_SERVICE, form_data, config);
}
