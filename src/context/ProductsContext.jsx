import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
} from "../pages/catalog/catalogSlice";

const ProductsContext = createContext(null);

export function ProductsContextProvider({ children }) {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const { status, isLoaded } = useSelector((state) => state.catalog);

  useEffect(() => {
    if (!isLoaded && status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, isLoaded, status]);

  const refresh = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const value = useMemo(
    () => ({ products, status, isLoaded, refresh }),
    [products, status, isLoaded, refresh]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProductsContext must be used within ProductsContextProvider");
  }

  return context;
}
