"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddLotPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    lotNumber: "",
    artistName: "",
    yearProduced: "",
    subject: "",
    description: "",
    estimatedPrice: "",
    category: "",
  });

  const [lotError, setLotError] = useState("");

  // VALIDATE LOT NUMBER LIVE
  function handleLotNumberChange(value: string) {
    // Allow input only if numeric
    if (!/^\d*$/.test(value)) return;

    setForm({ ...form, lotNumber: value });

    if (value.length !== 8) {
      setLotError("Lot Number must be exactly 8 digits.");
    } else {
      setLotError("");
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Final validation before submitting
    if (form.lotNumber.length !== 8) {
      setLotError("Lot Number must be exactly 8 digits.");
      return;
    }

    const res = await fetch("/api/lots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        yearProduced: Number(form.yearProduced),
        estimatedPrice: Number(form.estimatedPrice),
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to add lot");
    }
  }

  return (
    <main
      style={{
        padding: "clamp(1.5rem, 4vw, 3rem)",
        maxWidth: "700px",
        margin: "0 auto",
        background: "black",
        color: "white",
       
       
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        
          paddingBottom: "0.5rem",
        }}
      >
        Add New Auction Lot
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* LOT NUMBER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <input
            name="lotNumber"
            placeholder="Lot Number (8 digits)"
            required
            value={form.lotNumber}
            onChange={(e) => handleLotNumberChange(e.target.value)}
            maxLength={8}
            style={{
              padding: "0.75rem",
              borderRadius: "10px",
              border: lotError ? "2px solid red" : "2px solid white",
              background: "black",
              color: "white",
              fontWeight: "bold",
            }}
          />

          {lotError && (
            <span style={{ color: "red", fontSize: "0.9rem" }}>{lotError}</span>
          )}
        </div>

        <input
          name="artistName"
          placeholder="Artist Name"
          required
          value={form.artistName}
          onChange={handleChange}
          style={{
            padding: "0.75rem",
            borderRadius: "10px",
            border: "2px solid white",
            background: "black",
            color: "white",
          }}
        />

<input
  type="date"
  name="yearProduced"
  required
  onChange={(e) => {
    const selected = e.target.value;
    if (!selected) return;

    const year = new Date(selected).getFullYear().toString();

    setForm({
      ...form,
      yearProduced: year,
    });
  }}
  style={{
    padding: "0.75rem",
    borderRadius: "10px",
    border: "2px solid white",
    background: "white",
    color: "black",
  }}
/>



        <select
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          style={{
            padding: "0.75rem",
            borderRadius: "10px",
            border: "2px solid white",
            background: "black",
            color: "white",
          }}
        >
          <option value="">Select Subject Classification</option>
          <option value="LANDSCAPE">Landscape</option>
          <option value="SEASCAPE">Seascape</option>
          <option value="PORTRAIT">Portrait</option>
          <option value="FIGURE">Figure</option>
          <option value="STILL_LIFE">Still Life</option>
          <option value="NUDE">Nude</option>
          <option value="ANIMAL">Animal</option>
          <option value="ABSTRACT">Abstract</option>
          <option value="OTHER">Other</option>
        </select>

        <textarea
          name="description"
          placeholder="Detailed Description"
          rows={4}
          required
          value={form.description}
          onChange={handleChange}
          style={{
            padding: "0.75rem",
            borderRadius: "10px",
            border: "2px solid white",
            background: "black",
            color: "white",
          }}
        />

        <input
          type="number"
          name="estimatedPrice"
          placeholder="Estimated Price (£)"
          required
          value={form.estimatedPrice}
          onChange={handleChange}
          style={{
            padding: "0.75rem",
            borderRadius: "10px",
            border: "2px solid white",
            background: "black",
            color: "white",
          }}
        />

        <select
          name="category"
          required
          value={form.category}
          onChange={handleChange}
          style={{
            padding: "0.75rem",
            borderRadius: "10px",
            border: "2px solid white",
            background: "black",
            color: "white",
          }}
        >
          <option value="">Select Category</option>
          <option value="PAINTING">Painting</option>
          <option value="DRAWING">Drawing</option>
          <option value="PHOTOGRAPH">Photographic Image</option>
          <option value="SCULPTURE">Sculpture</option>
          <option value="CARVING">Carving</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            fontWeight: "bold",
            border: "2px solid white",
            background: "black",
            color: "white",
            cursor: "pointer",
            borderRadius: "10px",
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "white",
             e.currentTarget.style.color = "black")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "black",
             e.currentTarget.style.color = "white")
          }
        >
          Save Lot
        </button>
      </form>
    </main>
  );
}
