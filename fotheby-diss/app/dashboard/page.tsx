async function getLots() {
  const res = await fetch("http://localhost:3000/api/lots", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Dashboard() {
  const lots = await getLots();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Fotheby’s Auction Catalogue</h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Lot</th>
            <th>Artist</th>
            <th>Category</th>
            <th>Estimated Price</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot: any) => (
            <tr key={lot.lotNumber}>
              <td>{lot.lotNumber}</td>
              <td>{lot.artistName}</td>
              <td>{lot.category}</td>
              <td>£{lot.estimatedPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
