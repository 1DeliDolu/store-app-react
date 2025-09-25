import Grid from "@mui/material/Grid";
import ProductCard from "./ProductCard";

export default function ProductList({ products = [] }) {
  if (!products || products.length === 0) return <p>Ürün bulunamadı.</p>;

  return (
    <Grid container spacing={2}>
      {products.map((p) => (
        <Grid key={p.id} item xs={6} md={4} lg={3}>
          <ProductCard product={p} />
        </Grid>
      ))}
    </Grid>
  );
}
