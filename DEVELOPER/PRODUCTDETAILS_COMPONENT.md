# Product Details Bileşeni - Detaylı Açıklama

Bu doküman `src/pages/ProductDetails.jsx` ve `src/components/ProductItem.jsx` dosyalarının ne yaptığını, beklenen veri şekillerini, olası hata/kenar durumlarını, erişilebilirlik notlarını ve uygulanabilir geliştirme önerilerini açıklar.

## Kısa özet

- `ProductDetails.jsx`: URL'den ürün `id` parametresini alır, backend'den ilgili ürün verisini çeker, `loading` durumunu yönetir ve `ProductItem` bileşenine verir.
- `ProductItem.jsx`: Tek bir ürünün detay görünümünü (görsel + başlık + açıklama) grid içinde render eder.

---

## `src/pages/ProductDetails.jsx` — Nasıl çalışır

- Hook'lar:

  - `useParams()` ile route parametresi `id` okunur.
  - `useState(true)` `loading` için, `useState(null)` `product` için.
  - `useEffect(..., [id])` id değiştiğinde ürünü tekrar çeker.

- `fetchProductDetails` adımları:

  1.  `fetch('http://localhost:5001/products/' + id)` ile backend çağrısı yapar.
  2.  `response.json()` ile yanıt parse edilir.
  3.  `setProduct(data)` ile state güncellenir.
  4.  Hata durumunda `console.log(error)` ile loglanır.
  5.  `finally` içinde `setLoading(false)` ile yüklenme kapatılır.

- Render davranışı:
  - `loading` true ise `<h1>Loading...</h1>` döndürülür.
  - `loading` false ise: `<ProductItem product={product} />` render edilir.

### Varsayımlar / veri şekli

- Backend'den dönen `data` tek bir ürün nesnesidir: `{ id, title, description, image, price, ... }`.

### Eksiklikler ve iyileştirme alanları

- `response.ok` kontrolü yok: sunucu 404/500 dönerse `response.json()` hatalı sonuç üretebilir. Öneri: `if (!response.ok) throw new Error(response.statusText)`.
- Hata kullanıcıya gösterilmiyor; `error` state'i eklenip uygun UI (404 mesajı veya genel hata bildirimi) gösterilmeli.
- İstek iptali (cleanup) yok — bileşen unmount olursa veya id hızla değişirse istek yönetimi için `AbortController` eklenmeli.
- `loading` UI daha kullanıcı dostu olabilir (spinner, skeleton). Şu an yalnızca `<h1>Loading...</h1>` var.

---

## `src/components/ProductItem.jsx` — Nasıl çalışır

- Yapı:
  - MUI `Grid` ile iki sütunlu layout: sol sütun görsel (`Paper` içinde `img`), sağ sütun başlık ve açıklama (`Paper` içinde `Typography`).
  - Grid responsive olarak `lg`, `md`, `sm`, `xs` değerleriyle ayarlanmış.

### Beklenen product shape

- `product.image` : dosya adı veya URL (mevcut kod backend'e `http://localhost:5001/images/${product.image}` ile erişiyor).
- `product.title` : string
- `product.description` : string

### Potansiyel problemler / kenar durumları

- `product` null/undefined ise bileşen hata verebilir; çağıran taraf `ProductDetails.jsx`'te `loading` kontrolü olsa da ek güvenlik için `ProductItem` içinde de `if (!product) return null;` veya benzeri kontrol eklenebilir.
- `product.image` eksikse `<img>` kırık görsel gösterir — `onError` fallback resmi veya placeholder kullanılmalı.
- Görselin `alt` attribute'u yok; erişilebilirlik için `alt={product.title}` gibi bir değer eklenmeli.

### Erişilebilirlik (a11y)

- Başlık `Typography component="h1"` ile semantik olarak işaretlenmiş; detay sayfasında tekil ürün için bu uygundur.
- Görsel için `alt` eksikliği düzeltilmeli.

### Stil / tasarım notları

- `Paper` içinde `img` inline style ile `width: "100%"` verilmiş — bu hızlı bir çözüm, ancak `sx` veya CSS sınıfı kullanmak daha uygundur.

---

## Önerilen küçük değişiklikler (uygulanabilir, düşük risk)

1. `ProductDetails.jsx` içinde hata state ve response.ok kontrolü ekle:

   - `const [error, setError] = useState(null);` ve `if (!response.ok) throw new Error(response.status)` gibi.
   - Hata durumunda kullanıcıya uygun mesaj göster: 404 -> "Ürün bulunamadı", diğer hatalar -> genel hata UI.

2. AbortController kullanarak istek iptali ekle:

   - `const controller = new AbortController();` ve `fetch(url, { signal: controller.signal })`.
   - `useEffect` cleanup'inde `controller.abort()` çağrın.

3. `ProductItem.jsx` içinde güvenlik kontrolleri ve erişilebilirlik:

   - `if (!product) return <p>Ürün bulunamadı.</p>` gibi erken dönüş.
   - `<img alt={product.title || 'Ürün görseli'} onError={e => (e.target.src = '/placeholder.png')} />` fallback.

4. Loading UI iyileştirmesi: MUI `Skeleton` veya `CircularProgress` ile daha iyi kullanıcı deneyimi sağlayın.

5. SEO / paylaşım meta: detay sayfası server-side meta yoksa, SPA içinde sosyal paylaşım meta'ları dinamik olarak set eden küçük bir util eklenebilir (ör. document.title, meta tags).

---

## Test önerileri (hızlı)

- `ProductDetails`:

  - Mock fetch ile: başarılı fetch -> `ProductItem` render ediliyor mu?
  - 404 fetch -> kullanıcıya "Ürün bulunamadı" gösteriliyor mu?

- `ProductItem`:
  - product prop'u eksikse güvenli davranış (null guard) test edilmelidir.
  - Görsel onError fallback davranışı test edilebilir (jest + rtl ile src değişimi simüle edilebilir).

---

## Nasıl çalıştırılır / hızlı deneme

Projeyi yerelde çalıştırmak için:

```bash
npm install
npm run dev
```

Ardından `http://localhost:5173/products/1` (veya mevcut bir `id`) ile detay sayfasını test edin. Backend `http://localhost:5001` çalışmıyorsa mock veriler veya JSON server ile hızlıca deneme yapabilirsiniz.

---

Özet: `ProductDetails.jsx` basit ve anlaşılır bir ürün detayı fetch akışına sahip ancak hata yönetimi, istek iptali ve daha iyi loading/fallback UI eksik. `ProductItem.jsx` ise temel detay görünümünü sağlıyor; erişilebilirlik ve görsel fallback eklemek fayda sağlar. Bu küçük düzeltmeler hızlıca uygulanabilir ve kullanıcı deneyimini önemli ölçüde iyileştirir.
