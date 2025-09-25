import Grid from "@mui/material/Grid";

export default function ProductList({ products = [] }) {
  if (!products || products.length === 0) return <p>Ürün bulunamadı.</p>;

  return (
    <Grid container spacing={2}>
      {products.map((p) => (
        <Grid
          item
          sx={{ backgroundColor: "primary.light" }}
          key={p.id}
          xs={6}
          md={4}
          lg={3}
        >
          {p.title}
        </Grid>
      ))}
    </Grid>
  );
}
