"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", {
      staffId,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res || res.error) {
      setErr("Invalid Staff ID or password.");
      return;
    }

    router.push(from);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, border: "1px solid white", padding: 20 }}>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>Staff Login</h1>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          Dashboard access is restricted to staff.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Staff ID</span>
            <input
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              style={{
                background: "black",
                color: "white",
                border: "1px solid white",
                padding: 10,
              }}
              autoComplete="username"
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: "black",
                color: "white",
                border: "1px solid white",
                padding: 10,
              }}
              autoComplete="current-password"
            />
          </label>

          {err && <div style={{ border: "1px solid white", padding: 10 }}>{err}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "white",
              color: "black",
              padding: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
