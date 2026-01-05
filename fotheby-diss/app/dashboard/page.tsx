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

  //  ADDED: Archive SOLD lots (STAFF/MANAGER only UI will call this)
  async function archiveLot(lotId: number) {
    await fetch("/api/lots/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotId }),
    });
    fetchLots();
  }

//delete function lot
async function deleteLot(lotNumber: string) {
  const confirmDelete = confirm("Are you sure?");
  if (!confirmDelete) return;

  await fetch(`/api/lots/${lotNumber}/delete`, {
    method: "DELETE",
  });

  fetchLots();
}


  const isStaffMode =
    authLoaded &&
    authUser &&
    sessionStorage.getItem("dashboardRoleChoice") !== "public";

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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
            zIndex: 0,
          }}
        >
          <div
            style={{
              background: "#000",
              color: "#fff",
              border: "2px solid #fff",
              borderRadius: "20px",
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

                // If already logged in as staff/manager, just close prompt
                if (authUser && (authUser.role === "STAFF" || authUser.role === "MANAGER")) {
                  setShowPrompt(false);
                  return;
                }

                //  Otherwise, go to login
                window.location.href = "/login";
              }}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                background: "#e61414ff",
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
        <div>
          <h1
            style={{
              fontFamily: "Ariel",
              fontSize: "2.5em",
              fontWeight: "bold",
            }}
          >
            Dashboard
          </h1>

          {authLoaded && authUser && !isPublicMode && (
            <span style={{ fontWeight: "bold", fontFamily: "monospace" }}>
              Hi {authUser.role} ({authUser.staffId})
            </span>
          )}
        </div>

        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
            background: "black",
            borderRadius: "15px",
            padding: "clamp(0.75rem, 3vw, 1.25rem)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexShrink: 0,
            }}
          >
            <Link href="/home" style={{ fontWeight: "bold", cursor: "pointer" }}>
              ← Home
            </Link>
          </div>

          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              fontFamily: "monospace",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            {isStaffMode && (
              <>
                <Link href="/auctions" style={{ padding: "0.4rem 0.6rem", whiteSpace: "nowrap" }}>
                  Auctions
                </Link>
                <Link
                  href="/dashboard/archived"
                  style={{ padding: "0.4rem 0.6rem", whiteSpace: "nowrap" }}
                >
                  Archived Lots
                </Link>
              </>
            )}

            {isStaffMode && (
              <Link
                href="/lots/add"
                style={{ padding: "0.4rem 0.6rem", whiteSpace: "nowrap" }}
              >
                + Add New Lot
              </Link>
            )}

            {authLoaded && authUser && !isPublicMode && (
              <>
                {authUser.role === "MANAGER" && (
                  <Link
                    href="/dashboard/staff"
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      padding: "0.4rem 0.6rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Staff
                  </Link>
                )}

                <a
                  href="/api/auth/signout?callbackUrl=/home"
                  onClick={() => {
                    setAuthUser(null);
                    setIsPublicMode(false);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onTouchStart={() => setIsPressed(true)}
                  onTouchEnd={() => setIsPressed(false)}
                  style={{
                    border: "1px solid #fff",
                    background: isPressed || isHovered ? "#000" : "red",
                    color: isPressed || isHovered ? "#fff" : "#000",
                    transition: "background 0.25s ease, color 0.25s ease",
                    borderRadius: "10px",
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    minHeight: "40px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "100%",
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
            style={{
              border: "none",
              outline: "none",
              background: "black",
              borderRadius: "10px",
              padding: "10px",
            }}
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
          {!loading && lots.length === 0 && <p>No matching auction lots found.</p>}

          {lots
            .filter((lot) => {
              // Buyer / Seller: only LISTED lots
              if (!isStaffMode) return lot.status === "LISTED";

              // Staff / Manager: all lots
              return true;
            })
            .map((lot) => (
              <div
                key={lot.id}
                style={{
                  border: "1px solid #ccc",
                  background: "black",
                  borderRadius: "15px",
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

                <Link href={`/lots/${lot.lotNumber}`} style={{ color: "red" }}>
                  View Lot Details →
                </Link>

                {/* ACTIONS (RIGHT SIDE) — STAFF / MANAGER ONLY */}
                {isStaffMode && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                      marginTop: "0.75rem",
                    }}
                  >
                    {lot.status === "DRAFT" && (
                      <button
                        onClick={() => listLot(lot.id)}
                        style={{
                          color: "yellow",
                          background: "black",
                          border: "1px solid yellow",
                          borderRadius: "8px",
                          padding: "0.4rem 0.7rem",
                          cursor: "pointer",
                          fontWeight: "bold",
                          outline: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <span>▸</span>
                        <span>List</span>
                      </button>
                    )}

                    {lot.status === "SOLD" && (
                      <button
                        onClick={() => archiveLot(lot.id)}
                        style={{
                          color: "#fff",
                          background: "black",
                          border: "1px solid #fff",
                          borderRadius: "8px",
                          padding: "0.4rem 0.7rem",
                          cursor: "pointer",
                          fontWeight: "bold",
                          outline: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <span>🗄</span>
                        <span>Archive</span>


                        
                      </button>




                    )}
                    {isStaffMode && (
  <button
    onClick={() => deleteLot(lot.lotNumber)}
    style={{
      color: "red",
      background: "black",
      border: "1px solid red",
      borderRadius: "8px",
      padding: "0.4rem 0.7rem",
      cursor: "pointer",
      fontWeight: "bold",
      outline: "none",
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
    }}
  >
    <span>🗑</span>
    <span>Delete</span>
  </button>
)}

                  </div>
                )}
              </div>
            ))}
        </section>
      </main>
    </>
  );
}
