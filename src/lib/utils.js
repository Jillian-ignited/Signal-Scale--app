import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchAnalysis(input) {
  const response = await fetch(`${API_URL}/api/intelligence/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analysis");
  }

  return response.json();
}
