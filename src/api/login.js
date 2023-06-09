import request from "@/utils/request";

export function getUserInfo(token) {
  return request({
    url: "/api/users/2",
    method: "get",
    params: {
      token
    }
  });
}
