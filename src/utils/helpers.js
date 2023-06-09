// import moment from "moment-timezone";
import moment from "moment";

export const convertDateFormat = function(UNIX_timestamp, format) {
  let date = new Date(UNIX_timestamp);
  return moment(String(date)).format(format);
};

export const phoneValidate = function(phone, reg) {
  let phoneRe = /^[+]?[0-9]+$/; ///^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

  if (reg) {
    return phoneRe;
  } else {
    return phoneRe.test(phone);
  }
};

export const postalCodeValidate = function(code, reg) {
  let codeRe = /^[0-9]+$/; ///^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
  if (reg) {
    return codeRe;
  } else {
    return codeRe.test(code);
  }
  // return codeRe.test(code);
};

export const lppCodeValidate = function(code, reg) {
  let codeRe = /^[a-zA-Z0-9 _-]+$/; ///^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

  if (reg) {
    return codeRe;
  } else {
    return codeRe.test(code);
  }

  // return codeRe.test(code);
};

export const emailValidate = function(email, reg) {
  let re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (reg) {
    return re;
  } else {
    return re.test(email);
  }
};

export const nameValidate = function() {
  return true; ///^[a-zA-Z ]+$/.test(name);
};

export const urlValidate = function(url) {
  if (url === null) {
    return false;
  } else if (
    url.match(
      // eslint-disable-next-line no-useless-escape
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    ) !== null
  ) {
    return true;
  }

  return false;
};

export const replaceImageByDefault = function(e) {
  e.target.src = "";
};
