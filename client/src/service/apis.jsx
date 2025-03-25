const BASE_URL = "https://bytical-assign-project.onrender.com/api/v1";

export const auth = {
  SIGNUP_API: BASE_URL + "/user/register",
  LOGIN_API: BASE_URL + "/user/login",
  GET_ALL_USER: BASE_URL + "/user/all-user-details",
};

export const chat = {
  SEND_MSG_API: BASE_URL + "/message/send-message",
  GET_ALL_MSG_API: BASE_URL + "/message/get-message",
};
