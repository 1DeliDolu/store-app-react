import Grid from "@mui/material/Grid";
import { Paper, Typography } from "@mui/material";

export default function ProductItem({ product }) {
  if (!product) return <p>Ürün bulunamadı.</p>;

  return (
    <Grid container spacing={2}>
      <Grid item lg={4} md={5} sm={6} xs={12}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <img
            src={`http://localhost:5001/images/${product.image}`}
            style={{ width: "100%" }}
            alt={product.title || "Ürün görseli"}
            onError={(e) => (e.target.src = "/placeholder.png")}
          />
        </Paper>
      </Grid>
      <Grid item lg={8} md={7} sm={6} xs={12}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography component="h1" variant="h4" color="secondary.dark">
            {product.title}
          </Typography>
          <Typography variant="body1">{product.description}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
