"use client";

import { useState } from "react";

export default function StaffManagementPage() {
  const [createResult, setCreateResult] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateResult(null);

    const form = e.currentTarget;
    const staffId = (form.staffId as any).value;
    const password = (form.password as any).value;
    const name = (form.name as any).value;

    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId, password, name }),
    });

    const data = await res.json();
    setCreateResult(data.message || data.error);
    form.reset();
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResetResult(null);

    const form = e.currentTarget;
    const staffId = (form.staffId as any).value;
    const newPassword = (form.newPassword as any).value;

    const res = await fetch("/api/staff/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId, newPassword }),
    });

    const data = await res.json();
    setResetResult(data.message || data.error);
    form.reset();
  }

  return (
    <main
      style={{
        background: "black",
        color: "white",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>
        Staff Management (Manager Only)
      </h1>

      {/* CREATE STAFF */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 12 }}>Create Staff Account</h2>

        <form onSubmit={handleCreate} style={{ display: "grid", gap: 12, maxWidth: 400 }}>
          <input name="staffId" placeholder="Staff ID" required />
          <input name="name" placeholder="Name (optional)" />
          <input name="password" type="password" placeholder="Password" required />

          <button
            type="submit"
            style={{
              background: "white",
              color: "black",
              padding: 10,
              fontWeight: 600,
            }}
          >
            Create Staff
          </button>
        </form>

        {createResult && <p style={{ marginTop: 12 }}>{createResult}</p>}
      </section>

      {/* RESET PASSWORD */}
      <section>
        <h2 style={{ marginBottom: 12 }}>Reset Staff Password</h2>

        <form onSubmit={handleReset} style={{ display: "grid", gap: 12, maxWidth: 400 }}>
          <input name="staffId" placeholder="Staff ID" required />
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            required
          />

          <button
            type="submit"
            style={{
              background: "white",
              color: "black",
              padding: 10,
              fontWeight: 600,
            }}
          >
            Reset Password
          </button>
        </form>

        {resetResult && <p style={{ marginTop: 12 }}>{resetResult}</p>}
      </section>
    </main>
  );
}
