
/* LUXRIDE — AUTH SERVICE */

import { apiRequest } from "./api";

export const requestOTP = (payload) => {
  return apiRequest("/auth/request-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const verifyOTP = (payload) => {
  return apiRequest("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getCurrentUser = () => {
  return apiRequest("/auth/me", {
    method: "GET",
  });
};

export function logout() {
  sessionStorage.removeItem("luxride_token");
  sessionStorage.removeItem("luxride_user");
}
