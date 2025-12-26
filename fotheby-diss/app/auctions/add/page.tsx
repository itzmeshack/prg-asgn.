"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddAuctionPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [auctionDate, setAuctionDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          auctionDate: auctionDate || null,
        }),
      });

      if (!res.ok) {
        setError("Failed to create auction.");
        setLoading(false);
        return;
      }

      router.push("/auctions");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "2rem",
        maxWidth: "600px",
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
        <h1>Create Auction</h1>
        <Link href="/auctions" style={{ color: "#fff" }}>
          ← Back to Auctions
        </Link>
      </header>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label>Auction Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Modern Art Evening Sale"
            style={{
              padding: "0.6rem",
              background: "#000",
              color: "#fff",
              border: "1px solid #555",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label>Auction Date (optional)</label>
          <input
            type="date"
            value={auctionDate}
            onChange={(e) => setAuctionDate(e.target.value)}
            style={{
              padding: "0.6rem",
              background: "#fff",
              color: "#000",
              border: "1px solid #555",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: "0.9rem" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#fff",
            color: "#000",
            padding: "0.7rem",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating…" : "Create Auction"}
        </button>
      </form>
    </main>
  );
}
