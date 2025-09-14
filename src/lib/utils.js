// src/lib/utils.js

// ✅ Set your backend API base URL
export const API_BASE_URL = "https://signal-scale.onrender.com/api";

/**
 * Generic fetch wrapper for API calls
 * @param {string} endpoint - API endpoint (e.g., "/intelligence/analyze")
 * @param {string} method - HTTP method (default: "GET")
 * @param {Object} body - Request body for POST/PUT
 * @returns {Promise<Object>} - JSON response
 */
export async function apiRequest(endpoint, method = "GET", body = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ API Request Failed:", error);
    throw error;
  }
}

/**
 * Convenience function for dynamic analysis
 * Example usage: analyzeData({ brand: "Crooks", dataset: "Q3" })
 */
export async function analyzeData(payload) {
  return apiRequest("/intelligence/analyze", "POST", payload);
}
