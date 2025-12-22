export default function HomePage() {
  return (
    <main style={{ padding: "3rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Fotheby’s Auction House</h1>

      <p>
        Fotheby’s is an international auction house specialising in the sale of
        fine art. Traditionally, auction catalogues and inventory records have
        been maintained using paper-based systems.
      </p>

      <p>
        This web-based prototype demonstrates a modern digital auction catalogue
        system designed to support the management of auction lots, improve
        accessibility, and enable faster searching and retrieval of item
        information.
      </p>

      <h2>System Capabilities</h2>
      <ul>
        <li>Add and manage auction lots</li>
        <li>Store category-specific item details</li>
        <li>Search and filter auction items</li>
        <li>View auction catalogue information digitally</li>
      </ul>

      <p>
        The system has been developed using an Agile / Rapid Application
        Development approach, with an emphasis on early functionality and client
        feedback.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <a
          href="/dashboard"
          style={{
            padding: "0.75rem 1.25rem",
            border: "1px solid black",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Enter Auction Catalogue
        </a>
      </div>
    </main>
  );
}
