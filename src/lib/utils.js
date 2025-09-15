const API_BASE = "https://signal-scale.onrender.com/api";

export async function analyzeIntelligence(payload = {}) {
  try {
    const response = await fetch(`${API_BASE}/intelligence/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} – ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error calling analyzeIntelligence:", err);
    throw err;
  }
}
