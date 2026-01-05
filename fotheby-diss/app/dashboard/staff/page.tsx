"use client";

import { useEffect, useState } from "react";

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Pagination State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });

  // Create staff form
  const [form, setForm] = useState({
    name: "",
    staffId: "",
    password: "",
    role: "STAFF",
  });

  // Load staff FROM API (search + pagination)
  async function loadStaff() {
    setLoading(true);

    const res = await fetch(`/api/staff?search=${search}&page=${page}`);
    const data = await res.json();

    setStaffList(data.items || []);
    setMeta({ totalPages: data.totalPages });
    setLoading(false);
  }

  // Reload when search or page changes
  useEffect(() => {
    loadStaff();
  }, [search, page]);

  // Form field change
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Create new staff
  async function createStaff(e: any) {
    e.preventDefault();

    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Staff created successfully.");
      setForm({ name: "", staffId: "", password: "", role: "STAFF" });
      loadStaff();
    } else {
      alert("Failed to create staff.");
    }
  }

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>Staff Management</h1>

      {/* CREATE STAFF FORM */}
      <section
        style={{
          padding: "1.5rem",
          border: "2px solid white",
          background: "white",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "black" }}>
          Create New Staff Account
        </h2>

        <form
          onSubmit={createStaff}
          style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}
        >
          <input
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="staffId"
            placeholder="Staff ID (e.g. S001)"
            required
            value={form.staffId}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="STAFF">Staff</option>
            <option value="MANAGER">Manager</option>
          </select>

          <button type="submit" style={buttonStyle}>
            Create Staff Account
          </button>
        </form>
      </section>

      {/* STAFF LIST */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>Existing Staff</h2>

        {/* SEARCH BAR */}
        <input
          placeholder="Search by staff ID or name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset pagination when typing
          }}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            background: "#000",
            color: "#fff",
            borderRadius: "10px",
          }}
        />

        {loading && <p>Loading staff...</p>}

        {!loading &&
          staffList.map((staff: any) => (
            <div
              key={staff.id}
              style={{
                border: "1px solid white",
                background: "black",
                padding: "1rem",
                borderRadius: "10px",
                marginBottom: "1.5rem",
              }}
            >
              <strong style={{ fontSize: "1.1rem" }}>{staff.name}</strong>
              <p>ID: {staff.staffId}</p>
              <p>Role: {staff.role}</p>

              {/* RESET PASSWORD */}
              <details
                style={{
                  marginTop: "1rem",
                  background: "#111",
                  padding: "1rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: "1px solid white",
                }}
              >
                <summary style={{ fontWeight: "bold" }}>
                  Reset Password
                </summary>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const newPassword = (e.target as any).newPassword.value;

                    const res = await fetch(
                      "/api/staff/reset-password",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          staffId: staff.staffId,
                          newPassword,
                        }),
                      }
                    );

                    if (res.ok) {
                      alert("Password reset successfully.");
                      (e.target as any).reset();
                    } else {
                      alert("Failed to reset password.");
                    }
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    marginTop: "1rem",
                  }}
                >
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    required
                    style={inputStyle}
                  />

                  <button type="submit" style={buttonStyle}>
                    Update Password
                  </button>
                </form>
              </details>

              {/* DELETE STAFF */}
<button
  onClick={async () => {
    if (
      !confirm(
        `Delete staff account "${staff.staffId}"? This cannot be undone.`
      )
    ) {
      return;
    }

    const res = await fetch("/api/staff/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: staff.staffId }),
    });

    if (res.ok) {
      alert("Staff account deleted.");
      loadStaff(); // reload list
    } else {
      alert("Failed to delete staff.");
    }
  }}
  style={{
    marginTop: "1rem",
    padding: "0.6rem",
    background: "black",
    border: "2px solid red",
    color: "red",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  }}
>
  <span>🗑</span>
  <span>Delete Staff</span>
</button>

            </div>
          ))}
      </section>

      {/* PAGINATION */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem",
          alignItems: "center",
        }}
      >
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span>
          Page {page} of {meta.totalPages}
        </span>

        <button
          disabled={page === meta.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}

// INPUT + BUTTON STYLES
const inputStyle: React.CSSProperties = {
  padding: "0.75rem",
  borderRadius: "10px",
  background: "black",
  border: "2px",
  outline: "none",
  color: "white",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem",
  borderRadius: "10px",
  background: "red",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};
