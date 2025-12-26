"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ArchivedLot = {
  id: number;
  lotNumber: string;
  artistName: string;
  category: string;
  subject: string;
  estimatedPrice: number;
  updatedAt: string;
};

export default function ArchivedLotsPage() {
  const [lots, setLots] = useState<ArchivedLot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lots/archived")
      .then((res) => res.json())
      .then((data) => {
        setLots(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Archived Lots</h1>
        <Link
          href="/dashboard"
          style={{
            color: "#fff",
            textDecoration: "underline",
          }}
        >
          ← Back to Dashboard
        </Link>
      </header>

      {loading && <p>Loading archived lots…</p>}

      {!loading && lots.length === 0 && (
        <p>No archived lots found.</p>
      )}

      {/* ARCHIVED LOTS LIST */}
      <section style={{ display: "grid", gap: "1rem" }}>
        {lots.map((lot) => (
          <div
            key={lot.id}
            style={{
              border: "1px solid #444",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              background: "#000",
            }}
          >
            <strong>Lot {lot.lotNumber}</strong>
            <span>Artist: {lot.artistName}</span>
            <span>Category: {lot.category}</span>
            <span>Subject: {lot.subject}</span>
            <span>Estimate: £{lot.estimatedPrice}</span>
            <span
              style={{
                fontSize: "0.85rem",
                color: "#aaa",
                marginTop: "0.25rem",
              }}
            >
              Archived on {new Date(lot.updatedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
