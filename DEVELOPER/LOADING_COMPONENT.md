# Loading ve Ürün Detay/List Sayfaları - Açıklama

Bu doküman `src/components/Loading.jsx`, `src/components/ProductItem.jsx`, `src/components/ProductList.jsx`, `src/pages/ProductDetails.jsx` ve `src/pages/Products.jsx` dosyalarının ne yaptığını, beklenen veri şekillerini, olası hata/kenar durumlarını, erişilebilirlik notlarını ve uygulanabilir geliştirme önerilerini açıklar.

## Kısa özet

- `Loading.jsx`: Uygulamada loading (yükleniyor) durumunu göstermek için kullanılan MUI tabanlı bileşen. `message` prop'u alır.
- `Products.jsx`: Tüm ürünleri backend'den çekip `ProductList`'e verir; yüklenme sırasında `Loading` kullanır.
- `ProductList.jsx`: `products` dizisini alır ve her ürün için `ProductCard` (veya `ProductItem` variantı) render eden grid bileşeni.
- `ProductItem.jsx`: Tek bir ürünün (detay) görünümünü sağlar; görsel, başlık ve açıklama içerir.
- `ProductDetails.jsx`: Route parametresinden `id` alıp tekil ürünü backend'den çekerek `ProductItem`'e verir.

---

## `src/components/Loading.jsx`

Ne yapar:

- MUI `Backdrop`, `Box`, `CircularProgress` ve `Typography` kullanarak tam sayfa bir yükleniyor ekranı gösterir.
- `message` prop'u ile gösterilecek metin özelleştirilebilir. Varsayılan: "Loading...".

Örnek kullanım:

- `if (loading) return <Loading message="Yükleniyor..." />;`

Erişilebilirlik ve UX notları:

- `Backdrop` `invisible={true}` ile arka plan kapatılmadan sadece içerik gösteriliyor; eğer etkileşim engellenecekse `invisible={false}` kullanılabilir.
- `CircularProgress` renk ve boyutları tema ile uyumlu olmalı.
- `Typography` konumu `position: fixed` ile verilmiş; küçük ekranlarda metin doğru hizalanmayabilir — responsive düzen kontrolü yapılmalı.

İyileştirme önerileri:

- `role="status"` ve `aria-live="polite"` ekleyerek ekran okuyucu kullanıcılarına loading durumunu bildirin.
- `Backdrop`'i invisible=false yapıp arka planı hafifçe opak yaparak kullanıcıya modal-like bir his verilebilir.
- Daha küçük/yerel loading gösterimleri için `Loading` bileşenine `fullScreen` prop'u ekleyin.

---

## `src/pages/Products.jsx`

Ne yapar:

- Mount olduğunda `http://localhost:5001/products/` adresine `fetch` isteği gönderir.
- Gelen veriyi `loadedProducts` state'ine atar ve `loading` state'ini yönetir.
- `loading` true iken `Loading` bileşenini gösterir; bitince `ProductList`'e ürünleri paslar.

Beklenen veri şekli:

- API bir dizi ürün döndürmelidir: `[{ id, title, price, image, ... }, ...]`.

Kenar durumları / eksiklikler:

- `response.ok` kontrolü yok. 4xx/5xx durumlarında hatalı davranış olabilir.
- Hata kullanıcıya gösterilmiyor. `error` state'i eklenmeli.
- `fetch` iptali yapılmıyor (AbortController önerilir) — kullanıcı hızlıca route değiştirirse istek devam edebilir.

Önerilen düzeltmeler:

- `if (!response.ok) throw new Error(response.statusText)` kontrolü ekleyin.
- `const controller = new AbortController()` ile fetch çağrısını iptal edin ve `useEffect` cleanup'inde `controller.abort()` çağırın.
- Hata durumu için `const [error, setError] = useState(null)` ekleyin ve kullanıcıya nazik bir mesaj gösterin.

---

## `src/components/ProductList.jsx`

Ne yapar:

- `products` prop'una gelen ürün dizisini MUI Grid içinde render eder. Her öğe için `ProductCard` veya `ProductItem` kullanır.

Beklenen props:

- `products`: Array – her öğe en az `id` ve `title`/`image` alanlarına sahip olmalı.

Kenar durumları:

- `products` undefined/null ise `products.map` hata verir. Bu nedenle `products = []` gibi bir güvenlik veya çağıran tarafta garanti gereklidir.
- Her öğeye benzersiz `key` atanmalı (`p.id`).

İyileştirme önerileri:

- Varsayılan parametre: `function ProductList({ products = [] })`.
- Boş liste kontrolü: kullanıcıya "Ürün bulunamadı" gösterin.
- Büyük listelerde performans için virtualization (react-window) düşünebilirsiniz.

---

## `src/components/ProductItem.jsx`

Ne yapar:

- Tek bir ürünün detay bölümünü grid ile iki sütun halinde gösterir: sol sütunda görsel (Paper içinde img), sağ sütunda başlık ve açıklama.

Beklenen product shape:

- `{ id, title, description, image, price? }`

Erişilebilirlik & hata yönetimi:

- `img` için `alt` attribute eklenmeli (örn. `alt={product.title}`) — aksi halde ekran okuyucu kullanıcıları görsel bilgisini kaçırır.
- `img` `onError` ile fallback görsel (placeholder) gösterilmeli.
- Bileşen `product` prop'u yoksa erken dönüş: `if (!product) return <p>Ürün bulunamadı.</p>`.

Stil notları:

- Inline `style={{ width: '100%' }}` yerine MUI `sx` veya sınıf kullanımı önerilir.

---

## `src/pages/ProductDetails.jsx`

Ne yapar:

- `useParams()` ile `id` okur, `fetch('http://localhost:5001/products/' + id)` ile tekil ürünü çeker.
- `loading` yönetimi ve `ProductItem`'e ürünü geçirir.

Eksiklikler & öneriler:

- `response.ok` kontrolü ve `error` state'i yok — 404/500 durumları düzgün işlenmiyor.
- `AbortController` ile istek iptali eklenmeli.
- Daha iyi UX için loading sırasında `Loading` yerine `Skeleton` veya daha küçük bir loading indicator kullanılabilir.

---

## Test önerileri

- `Products.jsx`:

  - Mock fetch ile: başarılı fetch -> `ProductList` renderi; hata -> hata mesajı; empty array -> boş liste mesajı.

- `ProductDetails.jsx`:

  - Geçerli id ile detay renderi; 404 mock ile "Ürün bulunamadı" testi.

- `ProductItem` / `ProductList`:
  - Görsel onError fallback testi, boş products testi, doğru grid item sayısı testi.

---

## Hızlı çalışma / deneme

Projeyi çalıştırmak için:

```bash
npm install
npm run dev
```

Ardından `http://localhost:5173/products` ve `http://localhost:5173/products/1` gibi yolları test edin. Backend `http://localhost:5001` çalışmıyorsa mock/veri sağlayın veya hızlıca `json-server` ile örnek endpoint oluşturun.

---

Özet: Mevcut yapıda loading UI, ürün listesi ve detay sayfaları temel olarak çalışır; eksiklikler çoğunlukla hata kontrolü, istek iptali (AbortController), erişilebilirlik (img alt, aria) ve boş durum yönetimi etrafında toplanıyor. Bu küçük düzeltmeler hem geliştirici deneyimini hem kullanıcı deneyimini iyileştirir.
