
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — BUS SERVICE
SINGLE DATE + DATE RANGE SUPPORT
*/

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

// ==========================================
// SEARCH BUSES
// ==========================================

export async function searchBuses({
  from,
  to,
  date,
  dateFrom,
  dateTo,
} = {}) {
  try {
    const cleanFrom = String(from || "").trim();
    const cleanTo = String(to || "").trim();

    // Backward compatibility:
    // Old single-date calls can still use { date }
    const cleanDate = String(date || "").trim();

    const cleanDateFrom = String(
      dateFrom || cleanDate
    ).trim();

    const cleanDateTo = String(
      dateTo || cleanDate
    ).trim();

    if (!cleanFrom || !cleanTo) {
      throw new Error(
        "Departure city and destination are required."
      );
    }

    if (cleanFrom.toLowerCase() === cleanTo.toLowerCase()) {
      throw new Error(
        "Source and destination cannot be the same."
      );
    }

    if (!cleanDateFrom || !cleanDateTo) {
      throw new Error(
        "Journey date or date range is required."
      );
    }

    if (cleanDateTo < cleanDateFrom) {
      throw new Error(
        "End date cannot be before start date."
      );
    }

    const params = new URLSearchParams({
      from: cleanFrom,
      to: cleanTo,
    });

    // Single date: preserve old API parameter
    if (cleanDateFrom === cleanDateTo) {
      params.set("date", cleanDateFrom);
    } else {
      // Date range
      params.set("dateFrom", cleanDateFrom);
      params.set("dateTo", cleanDateTo);
    }

    const url = `${API_URL}/buses/search?${params.toString()}`;

    console.log("LUXRIDE BUS SEARCH URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Unable to search buses."
      );
    }

    if (data?.success === false) {
      throw new Error(
        data?.message || "Bus search failed."
      );
    }

    return Array.isArray(data?.buses)
      ? data.buses
      : [];

  } catch (error) {
    console.error("SEARCH BUSES ERROR:", error);
    throw error;
  }
}

// ==========================================
// GET BUS DETAILS
// ==========================================

export async function getBusById(id) {
  try {
    if (!id) {
      throw new Error("Bus ID is required.");
    }

    const response = await fetch(
      `${API_URL}/buses/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || data?.success === false) {
      throw new Error(
        data?.message || "Unable to fetch bus details."
      );
    }

    if (!data?.bus) {
      throw new Error("Bus details not found.");
    }

    return data.bus;

  } catch (error) {
    console.error("GET BUS DETAILS ERROR:", error);
    throw error;
  }
}
