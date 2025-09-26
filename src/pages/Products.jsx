import ProductList from "../components/ProductList";
import Loading from "../components/Loading";
import { useProductsContext } from "../context/ProductsContext";

export default function ProductsPage() {
  const { products, status } = useProductsContext();

  if (status === "pendingFetchProducts") {
    return <Loading message="Yukleniyor..." />;
  }

  return (
    <div>
      <ProductList products={products} />
    </div>
  );
}
