import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router";
import { currenyTRY } from "../utils/formats";
import requests from "../api/apiClient";
import { useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useDispatch } from "react-redux";
import { setCart } from "../pages/cart/cartSlice";

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { setCart: setCartContext } = useCartContext();

  function handleAddItem(productId) {
    setLoading(true);
    requests.cart
      .addItem(productId)
      .then((cart) => {
        dispatch(setCart(cart));
        // sync context (if parts of app still read from context)
        try {
          setCartContext && setCartContext(cart);
        } catch (e) {
          // ignore if context not available
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }
  return (
    <Card>
      <CardActionArea component={Link} to={"/products/" + product.id}>
        <CardMedia
          sx={{ height: 160, backgroundSize: "contain" }}
          image={`http://localhost:5001/images/${product.image}`}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            color="primary.dark"
          >
            {product.title}
          </Typography>
          <Typography variant="body1" color="secondary.dark">
            {currenyTRY.format(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton>
          {/* <FavoriteIcon /> */}
          <FavoriteBorderIcon />
        </IconButton>
        <Button onClick={() => handleAddItem(product.id)}>
          {loading ? <CircularProgress size="20px" /> : "Sepete Ekle"}
        </Button>
      </CardActions>
    </Card>
  );
}
