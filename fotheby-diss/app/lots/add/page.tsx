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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1>Add New Auction Lot</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <input
          name="lotNumber"
          placeholder="Lot Number (8 digits)"
          required
          value={form.lotNumber}
          onChange={handleChange}
        />

        <input
          name="artistName"
          placeholder="Artist Name"
          required
          value={form.artistName}
          onChange={handleChange}
        />

        <input
          type="number"
          name="yearProduced"
          placeholder="Year Produced"
          required
          value={form.yearProduced}
          onChange={handleChange}
        />

    <select
  name="subject"
  required
  value={form.subject}
  onChange={handleChange}
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
        />

        <input
          type="number"
          name="estimatedPrice"
          placeholder="Estimated Price (£)"
          required
          value={form.estimatedPrice}
          onChange={handleChange}
        />

        <select
          name="category"
          required
          value={form.category}
          onChange={handleChange}
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
            border: "2px solid black",
            cursor: "pointer",
          }}
        >
          Save Lot
        </button>
      </form>
    </main>
  );
}
