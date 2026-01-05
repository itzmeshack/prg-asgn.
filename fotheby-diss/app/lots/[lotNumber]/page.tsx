import Link from "next/link";
import { auth } from "../../../auth";




/* ============================
   FETCH LOT (SERVER-SIDE)
   ============================ */
async function getLot(lotNumber: string) {
  const res = await fetch(`http://localhost:3000/api/lots/${lotNumber}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch lot");
  }

  return res.json();
}

/* ============================
   LOT DETAIL PAGE
   ============================ */
export default async function LotDetailPage({
  params,
}: {
  params: Promise<{ lotNumber: string }>;
}) {
  // 1️⃣ UNWRAP PARAMS
  const { lotNumber } = await params;

  // 2️⃣ FETCH LOT DATA
  const lot = await getLot(lotNumber);

  // 3️⃣ SERVER-SIDE AUTH CHECK (NextAuth v5)
  const session = await auth();
  const role = (session?.user as any)?.role;
  const isStaff = role === "STAFF" || role === "MANAGER";

  // 4️⃣ RENDER
  return (
    <main
      style={{
        padding: "clamp(1.5rem, 4vw, 3rem)",
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* HEADER */}
      <header style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/dashboard">← Back to Dashboard</Link>

        {/* STAFF / MANAGER ONLY */}
        {isStaff && (
          <>
            <Link href={`/lots/${lotNumber}/edit`} style={{ fontWeight: "bold" }}>
              Edit Lot
            </Link>

            <Link
              href={`/lots/${lotNumber}/images`}
              style={{ fontWeight: "bold" }}
            >
              Manage Images
            </Link>
          </>
        )}
      </header>

      {/* LOT TITLE */}
      <h1>Lot {lot.lotNumber}</h1>

      {/* LOT DETAILS */}
      <section style={{ display: "grid", gap: "1rem" }}>
        <Detail label="Artist" value={lot.artistName} />
        <Detail label="Year Produced" value={lot.yearProduced} />
        <Detail label="Category" value={lot.category} />
        <Detail label="Subject" value={lot.subject} />
        <Detail label="Estimated Price" value={`£${lot.estimatedPrice}`} />
      </section>

      {/* DESCRIPTION */}
      <section>
        <h2>Description</h2>
        <p>{lot.description}</p>
      </section>

      {/* IMAGES (VIEW-ONLY FOR PUBLIC) */}
      <section>
        <h2>Images</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {lot.images?.map((img: any) => (
            <img
              key={img.id}
              src={`/uploads/lots/${lot.lotNumber}/${img.filename}`}
              alt="Auction item"
              style={{ width: "100%", border: "1px solid #ccc" }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

/* ============================
   DETAIL COMPONENT
   ============================ */
function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <strong>{label}:</strong> {value}
    </div>
  );
}
