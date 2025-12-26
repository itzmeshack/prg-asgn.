"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditLotPage() {
  const router = useRouter();
  const params = useParams();
  const lotNumber = params.lotNumber as string;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    artistName: "",
    yearProduced: "",
    subject: "",
    description: "",
    estimatedPrice: "",
    category: "",
  });

  useEffect(() => {
    async function fetchLot() {
      const res = await fetch(`/api/lots/${lotNumber}`);
      const data = await res.json();

      setForm({
        artistName: data.artistName,
        yearProduced: data.yearProduced,
        subject: data.subject,
        description: data.description,
        estimatedPrice: data.estimatedPrice,
        category: data.category,
      });

      setLoading(false);
    }

    fetchLot();
  }, [lotNumber]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/lots/${lotNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        yearProduced: Number(form.yearProduced),
        estimatedPrice: Number(form.estimatedPrice),
      }),
    });

    if (res.ok) {
      router.push(`/lots/${lotNumber}`);
    } else {
      alert("Failed to update lot");
    }
  }

  if (loading) return <p>Loading...</p>;

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
      <h1>Edit Lot {lotNumber}</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <input
          name="artistName"
          value={form.artistName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="yearProduced"
          value={form.yearProduced}
          onChange={handleChange}
          required
        />

        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
        >
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
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="estimatedPrice"
          value={form.estimatedPrice}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="PAINTING">Painting</option>
          <option value="DRAWING">Drawing</option>
          <option value="PHOTOGRAPH">Photograph</option>
          <option value="SCULPTURE">Sculpture</option>
          <option value="CARVING">Carving</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            border: "2px solid black",
            fontWeight: "bold",
          }}
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
