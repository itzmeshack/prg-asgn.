import { text } from "stream/consumers";

export default function HomePage() {
  return (
    <main
      style={{
        padding: "clamp(1.5rem, 4vw, 3rem)",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
      }}
    >
      {/* HERO SECTION */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h1>Fotheby’s Auction House</h1>

        <a
          href="/dashboard"
          style={{
            alignSelf: "flex-start",
            marginTop: "0.5rem",
            padding: "0.75rem 1.5rem",
            border: "2px solid red",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Go to Dashboard
        </a>

        <p>
          Fotheby’s is a specialist fine art auction house operating within the
          international art market. The organisation acts as an intermediary
          between sellers and buyers, curating, valuing, and presenting artworks
          through professionally managed auctions.
        </p>

        {/* HERO IMAGE (SERVER-SAFE PLACEHOLDER + IMAGE) */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            border: "2px dashed #999",
            backgroundImage: "url(/images/hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#eaeaea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#555",
            textAlign: "center",
          }}

          
        >
  
        </div>
       <p style={{
    fontSize: "0.75rem",
    color: "#666",
    marginTop: "0.25rem",
  }}>photo by dau photograph</p>
        <p>
          Auction catalogues play a critical role in this process, providing
          detailed descriptions, provenance, and estimated values to support
          informed bidding decisions.
        </p>
      </section>

      {/* WHAT WE AUCTION */}
      <section style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <h2>What Fotheby’s Auctions</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            {label: "PAINTINGS & DRAWINGS", img: "/images/painting.jpg",  credit:"credit: AXP photography" },
            { label: "SCULPTURES & CARVINGS", img: "/images/scupture.jpg",  credit:" credit: photo by lily lili" },
            { label: "PHOTOGRAPHIC ART", img: "/images/photographic.jpg" ,  credit:" credit: photo by Matheus bertelli"},

          ].map(({ label, img, credit}) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  border: "2px dashed #aaa",
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "0.9rem",
                }}
              >
                
              </div>
<p style={{ fontWeight: "bold" }}>{label}</p>

<p
  style={{
    fontSize: "0.75rem",
    color: "#666",
    marginTop: "0.25rem",
  }}
>
  {credit}
</p>

            </div>
          ))}
        </div>
      </section>

      {/* WHY DIGITAL */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h2>Why a Digital Auction Catalogue?</h2>

        <p>
          Traditional paper-based catalogue systems limit accessibility, slow
          down information retrieval, and restrict the reach of auction listings.
          As client expectations evolve, there is increasing demand for faster,
          searchable, and more flexible access to auction data.
        </p>

        <p>
          This prototype system demonstrates how Fotheby’s can digitise its
          auction catalogue, enabling efficient lot management, category-specific
          documentation, and rapid searching while preserving the prestige and
          professionalism expected of a fine art auction house.
        </p>
      </section>

      {/* ABOUT SYSTEM */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h2>About This System</h2>

        <p>
          The Auction Catalogue System is an early-stage prototype developed
          using an Agile and Rapid Application Development methodology. The
          system allows authorised staff to add, search, and manage auction lots
          through a web-based interface.
        </p>

        <p>
          The prototype provides a foundation for future enhancements, including
          expanded category support, digital catalogues, and online bidding
          functionality.
        </p>
      </section>
    </main>
  );
}
