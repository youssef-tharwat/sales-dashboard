export function authHeader() {
  // return authorization header with jwt token
  let token = JSON.parse(localStorage.getItem("user-token"));

  if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}
