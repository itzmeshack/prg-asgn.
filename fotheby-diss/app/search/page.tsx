"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Lot = {
  lotNumber: number;
  artistName: string;
  category: string;
  subject: string;
  estimatedPrice: number;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const subject = searchParams.get("subject") || "";

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);

      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (category) params.append("category", category);
      if (subject) params.append("subject", subject);

      const res = await fetch(`/api/lots/search?${params.toString()}`);
      const data = await res.json();

      setLots(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    fetchResults();
  }, [q, category, subject]);

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Search Results</h1>

      {loading && <p>Searching auction lots…</p>}
      {!loading && lots.length === 0 && <p>No matching auction lots found.</p>}

      <section style={{ display: "grid", gap: "1rem" }}>
        {lots.map((lot) => (
          <div
            key={lot.lotNumber}
            style={{ border: "1px solid #ccc", padding: "1rem" }}
          >
            <strong>Lot {lot.lotNumber}</strong>
            <p>Artist: {lot.artistName}</p>
            <p>Category: {lot.category}</p>
            <p>Subject: {lot.subject}</p>
            <p>Estimate: £{lot.estimatedPrice}</p>

            <Link href={`/lots/${lot.lotNumber}`}>
              View Lot Details →
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
