"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lot = {
  lotNumber: string;
  artistName: string;
  category: string;
  subject: string;
  estimatedPrice: number;
};

export default function DashboardPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [searchText, setSearchText] = useState(""); // lot number / description
  const [artist, setArtist] = useState(""); // ENUM-safe
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchLots() {
    setLoading(true);

    const params = new URLSearchParams();

    // Artist ENUM (exact match)
    if (artist) params.append("q", artist);

    // Lot number / description (string search)
    if (searchText) params.append("q", searchText);

    if (category) params.append("category", category);
    if (subject) params.append("subject", subject);

    try {
      const res = await fetch(`/api/lots/search?${params.toString()}`);
      const data = await res.json();
      setLots(Array.isArray(data) ? data : []);
    } catch {
      setLots([]);
    }

    setLoading(false);
  }

  // Auto-refresh when filters change
  useEffect(() => {
    fetchLots();
  }, [artist, searchText, category, subject]);

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Auction Catalogue Dashboard</h1>
        <Link href="/lots/add">+ Add New Lot</Link>
      </header>

      {/* SEARCH & FILTERS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* ARTIST ENUM DROPDOWN */}
        <select value={artist} onChange={(e) => setArtist(e.target.value)}>
          <option value="">All Artists</option>
          <option value="RODIN">Rodin</option>
          <option value="PICASSO">Picasso</option>
          <option value="MICHELANGELO">Michelangelo</option>
          <option value="VAN_GOGH">Van Gogh</option>
        </select>

        {/* LOT NUMBER / DESCRIPTION */}
        <input
          placeholder="Search by lot number or description"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* CATEGORY */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="PAINTING">Painting</option>
          <option value="DRAWING">Drawing</option>
          <option value="PHOTOGRAPH">Photograph</option>
          <option value="SCULPTURE">Sculpture</option>
          <option value="CARVING">Carving</option>
        </select>

        {/* SUBJECT */}
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">All Subjects</option>
          <option value="LANDSCAPE">Landscape</option>
          <option value="SEASCAPE">Seascape</option>
          <option value="PORTRAIT">Portrait</option>
          <option value="FIGURE">Figure</option>
          <option value="STILL_LIFE">Still Life</option>
          <option value="ABSTRACT">Abstract</option>
          <option value="OTHER">Other</option>
        </select>
      </section>

      {/* RESULTS */}
      <section style={{ display: "grid", gap: "1rem" }}>
        {loading && <p>Loading lots…</p>}
        {!loading && lots.length === 0 && (
          <p>No matching auction lots found.</p>
        )}

        {lots.map((lot) => (
          <div
            key={lot.lotNumber}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            <strong>Lot {lot.lotNumber}</strong>
            <span>Artist: {lot.artistName}</span>
            <span>Category: {lot.category}</span>
            <span>Subject: {lot.subject}</span>
            <span>Estimate: £{lot.estimatedPrice}</span>

            <Link href={`/lots/${lot.lotNumber}`}>
              View Lot Details →
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
