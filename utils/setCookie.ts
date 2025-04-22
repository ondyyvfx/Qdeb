import Cookies from "js-cookie";

export const setAuthCookie = (token: string) => {
  Cookies.set("token", token, { expires: 1 }); // 1 день
};
