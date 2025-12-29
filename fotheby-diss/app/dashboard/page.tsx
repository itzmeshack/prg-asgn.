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
  /* ============================
     AUTH + UI MODE STATE
     ============================ */
  const [authUser, setAuthUser] = useState<null | { role?: string; staffId?: string }>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  // ✅ THIS WAS MISSING BEFORE
  const [isPublicMode, setIsPublicMode] = useState(false);

  /* ============================
     LOAD AUTH SESSION
     ============================ */
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const s = await res.json();

        console.log("SESSION RESPONSE:", s); // debug

        const role = s?.user?.role;
        const staffId = s?.user?.staffId;

        if (role && staffId) {
          setAuthUser({ role, staffId });
        } else {
          setAuthUser(null);
        }
      } catch {
        setAuthUser(null);
      } finally {
        setAuthLoaded(true);
      }
    }

    loadSession();
  }, []);

  /* ============================
     ROLE SELECTION PROMPT
     ============================ */
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromHome = params.get("from") === "home";

    if (fromHome) {
      setShowPrompt(true);

      // 🔒 reset UI mode when entering from home
      setIsPublicMode(false);
      setAuthUser(null);
      sessionStorage.removeItem("dashboardRoleChoice");

      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  /* ============================
     EXISTING DASHBOARD STATE
     ============================ */
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
    <>
      {/* ============================
         ROLE SELECTION PROMPT
         ============================ */}
      {showPrompt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#000",
              color: "#fff",
              border: "2px solid #fff",
              padding: "2rem",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Dashboard Access</h2>

            <p style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
              Please choose how you want to continue.
            </p>

            {/* ADMIN / STAFF */}
            <button
            onClick={() => {
  sessionStorage.removeItem("dashboardRoleChoice");

  // ✅ If already logged in as staff/manager, just close prompt
  if (authUser && (authUser.role === "STAFF" || authUser.role === "MANAGER")) {
    setShowPrompt(false);
    return;
  }

  // ❌ Otherwise, go to login
  window.location.href = "/login";
}}

              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                background: "#fff",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Admin / Staff
            </button>

            {/* BUYER / SELLER */}
            <button
              onClick={() => {
                sessionStorage.setItem("dashboardRoleChoice", "public");
                setIsPublicMode(true);
                setShowPrompt(false);
              }}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#000",
                color: "#fff",
                border: "2px solid #fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Buyer / Seller
            </button>
          </div>
        </div>
      )}

      {/* ============================
         DASHBOARD UI
         ============================ */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/home" style={{ fontWeight: "bold" }}>
              ← Home
            </Link>
            <h1>Auction Catalogue Dashboard</h1>
          </div>

          <nav style={{ display: "flex", gap: "0.75rem" }}>
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

            {/* STAFF / MANAGER UI */}
            {authLoaded && authUser && !isPublicMode && (
              <>
                <span style={{ fontWeight: "bold" }}>
                  Hi {authUser.role} ({authUser.staffId})
                </span>

                {authUser.role === "MANAGER" && (
                  <Link href="/dashboard/staff" style={{ fontWeight: "bold" }}>
                    Staff
                  </Link>
                )}

                <a
                  href="/api/auth/signout?callbackUrl=/home"
                  onClick={() => {
                    setAuthUser(null);
                    setIsPublicMode(false);
                  }}
                  style={{
                    border: "1px solid #000",
                    padding: "0.35rem 0.7rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Logout
                </a>
              </>
            )}
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
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
