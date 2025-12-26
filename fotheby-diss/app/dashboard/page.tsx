"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lot = {
  id: number;
  lotNumber: string;
  artistName: string;
  category: string;
  subject: string;
  estimatedPrice: number;
  status: string;
};

export default function DashboardPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [searchText, setSearchText] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages] = useState(1);

  async function fetchLots() {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("pageSize", String(pageSize));

    if (artist) params.append("q", artist);
    if (searchText) params.append("q", searchText);
    if (category) params.append("category", category);
    if (subject) params.append("subject", subject);
    if (status) params.append("status", status);

    try {
      const res = await fetch(`/api/lots/search?${params.toString()}`);
      const data = await res.json();
      setLots(Array.isArray(data) ? data : []);
    } catch {
      setLots([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    setPage(1);
  }, [artist, searchText, category, subject, status]);

  useEffect(() => {
    fetchLots();
  }, [artist, searchText, category, subject, status, page]);

  async function listLot(lotId: number) {
    await fetch("/api/lots/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotId }),
    });
    fetchLots();
  }

  return (
    <main
      style={{
        padding: "clamp(1rem, 4vw, 2rem)",
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
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          borderBottom: "1px solid #ddd",
          paddingBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/home" style={{ fontWeight: "bold" }}>
            ← Home
          </Link>
          <h1 style={{ margin: 0, fontSize: "clamp(1.2rem, 4vw, 1.8rem)" }}>
            Auction Catalogue Dashboard
          </h1>
        </div>

        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <Link href="/auctions">Auctions</Link>
          <Link href="/dashboard/archived">Archived Lots</Link>
          <Link
            href="/lots/add"
            style={{
              border: "1px solid #000",
              padding: "0.35rem 0.7rem",
              fontWeight: "bold",
            }}
          >
            + Add New Lot
          </Link>
        </nav>
      </header>

      {/* FILTERS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        <input
          placeholder="Search by lot number or description"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="PAINTING">Painting</option>
          <option value="DRAWING">Drawing</option>
          <option value="PHOTOGRAPH">Photograph</option>
          <option value="SCULPTURE">Sculpture</option>
          <option value="CARVING">Carving</option>
        </select>

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

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="LISTED">Listed</option>
          <option value="SOLD">Sold</option>
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
            key={lot.id}
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
            <span>Status: {lot.status}</span>
            <span>Estimate: £{lot.estimatedPrice}</span>

            <Link href={`/lots/${lot.lotNumber}`}>
              View Lot Details →
            </Link>

            {lot.status === "DRAFT" && (
              <button
                style={{ marginTop: "0.5rem" }}
                onClick={() => listLot(lot.id)}
              >
                List Lot
              </button>
            )}

            {lot.status === "SOLD" && (
              <button
                style={{
                  marginTop: "0.5rem",
                  background: "#7c2d12",
                  color: "#fff",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  await fetch("/api/lots/archive", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lotId: lot.id }),
                  });
                  fetchLots();
                }}
              >
                Archive Lot
              </button>
            )}
          </div>
        ))}
      </section>

      {/* PAGINATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}
