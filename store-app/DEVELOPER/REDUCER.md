# Redux Toolkit & Reducer Dokümantasyonu

Bu doküman, projedeki `src/store` dizini, `src/store/store.js` ve `src/main.jsx` dosyalarının rolünü, Redux Toolkit ile nasıl genişletebileceğinizi, gerekli npm kurulum komutlarını ve React-Redux hook'larının kullanımını modern ve okunabilir bir şekilde açıklar.

## Kısa Yol Haritası

- Hedef: Uygulamada merkezi bir Redux store kurmak ve `cart` gibi slice'lar ile state yönetimini sağlamak.
- Çıktı: `DEVELOPER/REDUCER.md` içinde rehber + örnek kod blokları.
- Sonraki adım (opsiyonel): Rehberdeki örnek `cartSlice` dosyasını oluşturmak ve `store.js`'i güncellemek.

---

## Kontrat (Özet)

- Girdi: Mevcut Vite + React proje yapısı (bkz. `src/main.jsx`, `src/store/store.js`).
- Çıktı: Çalışan Redux store ve örnek slice'lar (örnek `cartSlice`).
- Hata modları: reducer eksikse `useSelector` ile `undefined` hatası alınabilir; payload doğrulaması yoksa beklenmeyen davranışlar görülebilir.

---

## Mevcut Dosyaların Rolü

- `src/main.jsx`

  - Uygulamanın giriş noktası. DOM'a React ağacını render eder.
  - Şu an `Provider` (Redux) en dışta, `CartContextProvider` ise onun içinde sarıyor. Bu sayede hem Redux hem de custom Context birlikte kullanılabiliyor.

- `src/store/store.js`

  - Şu an sadece `configureStore` çağrısı içeriyor fakat `reducer` boş: `reducer: {}`.
  - Buraya domain reducer'ları (örn. `cart`, `products`) eklenerek store aktif hale getirilir.

- `src/store` klasörü
  - Projede yalnızca `store.js` var. İyi bir yapı için `slices/` veya `features/` altına slice dosyaları eklenmesi önerilir.

---

## Hızlı Kurulum (Windows + bash.exe)

Proje kökünde aşağıdaki komutu çalıştırın:

```bash
npm install @reduxjs/toolkit react-redux
```

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Not: `package.json` içindeki script farklıysa ona göre çalıştırın.

---

## Örnek: `cartSlice.js` (Basit, üretime hazır olmayan ama öğretici)

Yeni bir dosya oluşturun: `src/store/cartSlice.js`

```javascript
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, title, price, quantity }
  totalQuantity: 0,
  totalPrice: 0,
};

const findItemIndex = (items, id) => items.findIndex((it) => it.id === id);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const item = action.payload; // { id, title, price, quantity = 1 }
      const idx = findItemIndex(state.items, item.id);
      if (idx >= 0) {
        state.items[idx].quantity += item.quantity ?? 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity ?? 1 });
      }
      state.totalQuantity = state.items.reduce((s, it) => s + it.quantity, 0);
      state.totalPrice = state.items.reduce(
        (s, it) => s + it.quantity * it.price,
        0
      );
    },
    removeItem(state, action) {
      const id = action.payload;
      state.items = state.items.filter((it) => it.id !== id);
      state.totalQuantity = state.items.reduce((s, it) => s + it.quantity, 0);
      state.totalPrice = state.items.reduce(
        (s, it) => s + it.quantity * it.price,
        0
      );
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const idx = findItemIndex(state.items, id);
      if (idx >= 0) state.items[idx].quantity = quantity;
      state.totalQuantity = state.items.reduce((s, it) => s + it.quantity, 0);
      state.totalPrice = state.items.reduce(
        (s, it) => s + it.quantity * it.price,
        0
      );
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
```

Kısa açıklama: `createSlice` hem action yaratır hem de reducer'ı tutar. Reducer fonksiyonları doğrudan `state`'i değiştiriyormuş gibi yazılır çünkü Toolkit immutability'yi immer ile yönetir.

---

## `store.js`'i Güncelleme

Örnek `src/store/store.js`:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // oluşturduğunuz dosya

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // product: productReducer, vb.
  },
});
```

Açıklama: `reducer` objesindeki anahtarlar state ağacında bölüm isimleri olur (ör. `state.cart.items`). `configureStore`, varsayılan middleware ve Redux DevTools desteğini otomatik sağlar.

---

## `main.jsx` ve Provider Sıralaması

Mevcut `src/main.jsx` (örnek):

```javascript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartContextProvider } from "./context/CartContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <CartContextProvider>
        <App />
      </CartContextProvider>
    </Provider>
  </StrictMode>
);
```

Notlar:

- `Provider` tüm alt bileşenlere `store`'u sağlar. `useSelector`/`useDispatch` kullanan bileşenler `Provider` içinde olmalıdır.
- `CartContextProvider` özel context sağlıyorsa ve içinde Redux hook'ları kullanılacaksa şu anki sıralama doğrudur (Provider dışta).

---

## React-Redux Hook'ları (Kısa Örnekler)

- useDispatch: action göndermek için.
- useSelector: store'dan veri okumak için.

Add to Cart butonu örneği:

```javascript
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";

function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() =>
        dispatch(
          addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
          })
        )
      }
    >
      Add to cart
    </button>
  );
}
```

Cart gösterimi örneği:

```javascript
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity, clearCart } from "../store/cartSlice";

function CartSummary() {
  const items = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const dispatch = useDispatch();
  // ... JSX
}
```

İyi uygulama: ağır hesaplamalar için memoized selector (reselect) kullanın.

---

## Dikkat Edilmesi Gereken Edge Case'ler

- `reducer` objesini eklememek -> `state.cart` undefined olur.
- Asenkron işlemler için `createAsyncThunk` veya başka middleware kullanın (`configureStore` thunk'ı default ekler).
- Performans: büyük state veya sık güncellemeler render patlaması yaratabilir — selector'ları daraltın.

---

## Gelişmiş Öneriler

- Persistence: `redux-persist` ile localStorage persist.
- TypeScript: `RootState` ve `AppDispatch` tipleri ekleyin.
- Testing: slice reducer'larını jest/mocha ile test edin.

---

## Quality Gates (Kısa Kontrol Listesi)

- Build: `npm run build` (vite) — proje build alabiliyor mu?
- Lint/Typecheck: projenizde ESLint/TypeScript varsa çalıştırın.
- Unit tests: slice için en az bir reducer testi yazın.
- Smoke test: bir komponentten `addItem` dispatch edip `CartSummary`'de değişimi doğrulayın.

---

## Kısaca Yapılacaklar (Özet)

1. `npm install @reduxjs/toolkit react-redux` çalıştırın.
2. `src/store/cartSlice.js` dosyasını ekleyin (örnek yukarıda).
3. `src/store/store.js`'i `cart` reducer ile güncelleyin.
4. `src/main.jsx`'de `Provider` zaten var; sıra uygunsa değişiklik gerekmez.
5. Bileşenlerde `useDispatch`/`useSelector` kullanarak store ile etkileşin.

---

