import React, { useState } from "react";

export default function BrandSetup({ onComplete }) {
  const [brand, setBrand] = useState("Demo Brand");
  const [competitors, setCompetitors] = useState("Competitor A, Competitor B");
  const [questions, setQuestions] = useState("What trends should we track?");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      brand: brand.trim(),
      competitors: competitors
        ? competitors.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      questions: questions
        ? questions.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    onComplete(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <h1>Signal & Scale — Setup</h1>

      <label>
        Brand
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Your brand name"
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        Competitors (comma-separated)
        <input
          type="text"
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
          placeholder="Brand 1, Brand 2"
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        Questions (comma-separated)
        <input
          type="text"
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          placeholder="What should we do next?, What to prioritize?"
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <button type="submit" style={{ padding: "10px 16px", cursor: "pointer" }}>
        Continue to Dashboard →
      </button>
    </form>
  );
}
