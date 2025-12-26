"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type LotImage = {
  id: number;
  filename: string;
};

export default function ManageImagesPage() {
  const params = useParams();
  const lotNumber = params.lotNumber as string;

  const [images, setImages] = useState<LotImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function loadImages() {
    const res = await fetch(`/api/lots/${lotNumber}`);
    const data = await res.json();
    setImages(data.images || []);
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/lots/${lotNumber}/images`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setStatus("Image uploaded successfully");
      setFile(null);
      loadImages(); // 🔄 refresh gallery
    } else {
      setStatus("Upload failed");
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
      <h1>Manage Images for Lot {lotNumber}</h1>

      <form onSubmit={handleUpload} style={{ display: "flex", gap: "1rem" }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">Upload</button>
      </form>

      {status && <p>{status}</p>}

      <section>
        <h2>Uploaded Images</h2>

        {images.length === 0 && <p>No images uploaded yet.</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {images.map((img) => (
            <img
              key={img.id}
              src={`/uploads/lots/${lotNumber}/${img.filename}`}
              alt="Auction item"
              style={{
                width: "100%",
                border: "1px solid #ccc",
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
