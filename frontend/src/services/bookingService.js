
import { apiRequest } from "./api";

export async function createBooking(payload) {
  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyBookings() {
  return apiRequest("/bookings/my");
}
