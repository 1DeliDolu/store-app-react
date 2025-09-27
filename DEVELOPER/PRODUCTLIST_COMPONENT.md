# ProductList Bileşeni ve İlgili Layout/Router Kodları - Detaylı Açıklama

Bu belge `src/App.jsx`, `src/components/Navbar.jsx`, `src/components/ProductList.jsx` ve `src/layouts/Main.jsx` dosyalarının ne yaptığını, nasıl birlikte çalıştıklarını, beklenen veri şekillerini, olası kenar durumlarını ve iyileştirme önerilerini açıklar.

## Kısa özet

- `App.jsx`: Uygulamanın router (yönlendirme) konfigürasyonunu kurar. `MainLayout` etrafında sayfa rotalarını tanımlar.
- `Main.jsx` (layout): Tüm sayfalarda ortak olarak gösterilen `Navbar` bileşenini ve sayfa içeriğini (`Outlet`) sarar. Ayrıca bir MUI `Container` ile içerik hizalaması sağlar.
- `Navbar.jsx`: Üst navigasyon çubuğu. Sayfalar arası gezinme linkleri, giriş/kayıt butonları ve sepet ikonunu içerir. MUI bileşenleri kullanır.
- `ProductList.jsx`: `products` prop'una gelen ürün dizisini MUI grid düzeniyle gösterir; her ürün için bir grid hücresi oluşturur.

---

## `src/App.jsx` — Router yapılandırması

- Kullanılan API: `createBrowserRouter` ve `RouterProvider` (react-router v6-style).
- Yapı:
  - En üst rota `/` ve bu rotanın `element`'i `MainLayout`.
  - `MainLayout`'in `children`'ı olarak sayfa rotaları verilmiş: `Home`, `Products`, `Cart`, `Login`, `Register`, `ProductDetails`.
  - `products` altında nested route: index -> `ProductsPage`, `:id` -> `ProductDetailsPage`.

### Davranış ve varsayımlar

- `MainLayout` her sayfada ortak görünür (navbar + container). Her sayfa kendi içeriğini `Outlet` üzerinden sağlar.
- `ProductDetailsPage`'in `:id` ile çalışması beklenir; detay sayfası route param'ı kullanarak tekil ürünü çekmelidir.

### İyileştirme önerileri

- Lazy loading (React.lazy + Suspense) ile route bazlı code-splitting yapılabilir — başlangıç bundle'ı küçülür.
- 404/NotFound route'u eklenmeli ve router config'ine yerleştirilmeli.

---

## `src/layouts/Main.jsx` — Layout (Global wrapper)

Mevcut kod (özet):

- `Navbar` render ediliyor.
- İçerik `Container` içinde `Outlet` ile gösteriliyor. `Container`'a `sx={{ mt: 3 }}` ile margin-top eklenmiş.

### Sorumluluklar

- Tüm sayfalarda ortak olan UI parçalarını tutmak (navbar, footer, global snackbar vb.).
- Sayfa içeriğini düzenlemek ve responsive davranışa yardımcı olmak.

### İyileştirme önerileri

- Global hata/snackbar state'i veya theme provider (MUI ThemeProvider) gibi uygulama çapında sağlayıcılar burada sarmalanmalı.
- Eğer uygulanacaksa `CssBaseline` ve `ThemeProvider` de bu layout içinde yer alabilir.

---

## `src/components/Navbar.jsx` — Navigasyon çubuğu

Öne çıkan parçalar:

- MUI bileşenleri: `AppBar`, `Toolbar`, `IconButton`, `Button`, `Badge`, `Box`.
- `links` ve `authLinks` adında iki dizi: gezinti ve kimlik (login/register) linkleri.
- `NavLink` (react-router) ile linkler oluşturuluyor; sepet için `Link` kullanılarak `/cart` rotasına yönlendirme sağlanıyor.
- Sabit `badgeContent="2"` kullanılmış (sepet öğe sayısı placeholder).

### İnteraktif davranış

- `NavLink` kullanımı, aktif rotaya stil/aktif class eklemek için uygundur (şimdilik custom active stil yok).
- `IconButton` içinde `StorefrontIcon` uygulama logosu gibi davranıyor.

### Güçlü ve zayıf yönler

- Güçlü: MUI ile erişilebilir, responsive çubuk kurulmuş.
- Zayıf: Sabit sepet sayısı; gerçek sepet state'i bağlantısı yok. Ayrıca `NavLink`'in aktif durumunu kullanarak görsel feedback eklenmemiş.

### Öneriler

- Sepet öğe sayısını global store (Context/Redux/Zustand) veya üst bileşenden prop ile alın.
- `NavLink` için `style` veya `className` fonksiyonu kullanılarak aktif link vurgulanmalı.
- Mobilde hamburger menu veya `Drawer` kullanılabilir (çok sayıda link olursa gereklidir).

---

## `src/components/ProductList.jsx` — Ürünlerin Grid ile Render Edilmesi

Mevcut kod (özet):

```jsx
import { Grid } from "@mui/material";

export default function ProductList({ products }) {
  return (
    <Grid container spacing={2}>
      {products.map((p) => (
        <Grid
          sx={{ backgroundColor: "primary.light" }}
          key={p.id}
          size={{ xs: 6, md: 4, lg: 3 }}
        >
          {p.title}
        </Grid>
      ))}
    </Grid>
  );
}
```

### Beklenen prop / veri şekli

- `products` bir dizi nesne (Array of objects) olmalıdır. Örnek: `[{ id: 1, title: 'Product A', price: 12.5, ... }, ...]`.

### Davranış

- `Grid` (MUI v5+ yeni Grid API) ile responsive grid hücreleri oluşturuluyor.
- Her ürün için `key={p.id}` var — bu iyi.

### Potansiyel problemler / edge cases

- `products` undefined veya `null` ise `products.map` hata verir. Bunu önlemek için props'a varsayılan değer (`products = []`) veya çağıran tarafta garanti edilmeli.
- `p.id` yoksa `key` olarak benzersiz başka bir alan kullanılması gerekir; yoksa React uyarısı verir.
- Şu an sadece `p.title` render ediliyor; ürün görseli, fiyat, butonlar (detay, sepete ekle) yok — kullanıcı deneyimi sınırlı.

### Erişilebilirlik & Stil

- Her grid hücresinin bir `role` veya semantik öğe (ör. article, heading) ile işaretlenmesi erişilebilirliği artırır.
- `sx` içinde doğrudan tema değerleri (`primary.light`) kullanılmış — bu genelde uygundur, fakat daha karmaşık stiller için ayrı bir stil bileşeni veya sınıf tercih edilebilir.

### Önerilen geliştirmeler (küçük, risksiz)

1. Güvenli props: `export default function ProductList({ products = [] }) { ... }`
2. Boş liste kontrolü:
   - Eğer `products.length === 0` ise kullanıcıya "Ürün bulunamadı" göster.
3. Zenginleştirilmiş öğe görünümü:
   - Kartlar (`Card`) kullanarak görsel, başlık, fiyat, butonlar ekle.
4. İyileştirme: büyük listeler için virtualization (`react-window`/`react-virtualized`).

### Hızlı örnek (geliştirilmiş render)

```jsx
export default function ProductList({ products = [] }) {
  if (products.length === 0) return <p>Ürün bulunamadı.</p>;

  return (
    <Grid container spacing={2}>
      {products.map((p) => (
        <Grid key={p.id} size={{ xs: 6, md: 4, lg: 3 }}>
          <article>
            <h3>{p.title}</h3>
            <p>{p.price ? `${p.price} ₺` : null}</p>
          </article>
        </Grid>
      ))}
    </Grid>
  );
}
```

---

## Test ve Kalite Kontrolleri

- Birim testleri (React Testing Library):
  - `ProductList` için: boş liste, tek ürün, çoklu ürün durumları test edilmeli.
  - `Navbar` için: linklerin render edilmesi, `to` prop'larının doğru olması, sepet butonunun bulunması test edilmeli.
- Lint/Types: Projeye TypeScript eklenmemişse, PropTypes veya JSDoc ile prop tipleri belirtilebilir. Bu, `products` gibi beklenen shape'leri belgelemeye yardımcı olur.

## Nasıl çalıştırılır (tekrar)

Projeyi çalıştırmak için kök dizinde:

```bash
npm install
npm run dev
```

Ardından tarayıcıda `http://localhost:5173` (Vite varsayılan) veya terminalde görünen URL'yi açın. API backend `http://localhost:5001/products/` çalışmıyorsa `Products` sayfası boş veya hata görünebilir.

---

## Özet - Öncelikli küçük geliştirme önerileri

1. `ProductList`'e varsayılan `products = []` ekle ve boş liste mesajı göster.
2. `Products.jsx` (sayfa) içinde `response.ok` kontrolü ve `error` state'i ekle.
3. `Navbar`'daki sepet sayısını gerçek state ile bağla.
4. Router için lazy loading ve 404 sayfası ekle.

Bu belgede belirtilen değişiklikler küçük, risksiz ve uygulama iyileştirmesi sağlayacaktır.
