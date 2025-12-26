"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Auction = {
  id: number;
  name: string;
  auctionDate: string | null;
  status: string;
  _count: { lots: number };
};

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auctions")
      .then((res) => res.json())
      .then((data) => {
        setAuctions(Array.isArray(data) ? data : []);
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
    <header
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <h1>Auctions</h1>

  <div style={{ display: "flex", gap: "1rem" }}>
    <Link href="/auctions/add" style={{ color: "#fff" }}>
      + Create Auction
    </Link>
    <Link href="/dashboard" style={{ color: "#fff" }}>
      ← Back to Dashboard
    </Link>
  </div>
</header>


      {loading && <p>Loading auctions…</p>}

      {!loading && auctions.length === 0 && (
        <p>No auctions found.</p>
      )}

      <section style={{ display: "grid", gap: "1rem" }}>
        {auctions.map((auction) => (
          <Link
            key={auction.id}
            href={`/auctions/${auction.id}`}
            style={{
              border: "1px solid #444",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <strong>{auction.name}</strong>
            <span>Status: {auction.status}</span>
            <span>
              Date:{" "}
              {auction.auctionDate
                ? new Date(auction.auctionDate).toLocaleDateString()
                : "Not scheduled"}
            </span>
            <span>Lots: {auction._count.lots}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
