"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AuctionDetailPage() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [availableLots, setAvailableLots] = useState<any[]>([]);
  const [selectedLotId, setSelectedLotId] = useState("");

  const [toast, setToast] = useState<null | {
    auctionName: string;
  }>(null);

  // FETCH AUCTION + LISTED LOTS
  useEffect(() => {
    fetch(`/api/auctions/${id}`)
      .then((res) => res.json())
      .then(setData);

    fetch("/api/lots?status=LISTED")
      .then((res) => res.json())
      .then((res) => setAvailableLots(res.items));
  }, [id]);

  // ASSIGN / REASSIGN LOT
  async function assignLot(force = false) {
    if (!selectedLotId) return;

    const res = await fetch("/api/auctions/assign-lot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lotId: Number(selectedLotId),
        auctionId: Number(id),
        force,
      }),
    });

    // CONFIRMATION REQUIRED
    if (res.status === 409) {
      const data = await res.json();
      setToast({
        auctionName: data.currentAuction.name,
      });
      return;
    }

    // SUCCESS
    if (res.ok) {
      window.location.reload();
    }
  }

  // CONFIRM REASSIGN
  async function confirmReassign() {
    await assignLot(true);
    setToast(null);
  }

  // COMPLETE AUCTION
  async function completeAuction() {
    await fetch("/api/auctions/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId: Number(id) }),
    });

    window.location.reload();
  }

  if (!data) return <p>Loading…</p>;

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{data.auction.name}</h1>

      <p>Status: <strong>{data.auction.status}</strong></p>

      {/* COMPLETE AUCTION BUTTON */}
      {data.auction.status !== "COMPLETED" && (
        <button
          onClick={completeAuction}
          style={{
            margin: "1rem 0",
            background: "#111",
            color: "#fff",
            padding: "0.6rem 1.2rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Complete Auction (Mark Lots as SOLD)
        </button>
      )}

      <hr />

      {/* ASSIGNED LOTS */}
      <h2>Lots in this auction</h2>

      {data.auction.lots.length === 0 && (
        <p>No lots assigned yet.</p>
      )}

      <ul>
        {data.auction.lots.map((lot: any) => (
          <li key={lot.id}>
            Lot {lot.lotNumber} — <strong>{lot.status}</strong>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "2rem 0" }} />

      {/* ASSIGN LOT */}
      {data.auction.status !== "COMPLETED" && (
        <>
          <h2>Assign / Reassign LISTED Lot</h2>

          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
          >
            <option value="">Select a lot</option>
            {availableLots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                Lot {lot.lotNumber}
                {lot.auction
                  ? ` — assigned to ${lot.auction.name}`
                  : " — available"}
              </option>
            ))}
          </select>

          <button
            onClick={() => assignLot(false)}
            disabled={!selectedLotId}
            style={{ marginLeft: "1rem" }}
          >
            Assign
          </button>
        </>
      )}

      {/* 🔔 CONFIRMATION TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            background: "#000",
            color: "#fff",
            padding: "1.25rem 1.5rem",
            borderRadius: "8px",
            width: "340px",
            zIndex: 1000,
            boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
          }}
        >
          <strong>Reassignment Warning</strong>

          <p style={{ margin: "0.75rem 0" }}>
            This lot is already assigned to{" "}
            <strong>{toast.auctionName}</strong>.
          </p>

          <p>Do you want to reassign it?</p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={() => setToast(null)}
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              NO
            </button>

            <button
              onClick={confirmReassign}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              YES
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
