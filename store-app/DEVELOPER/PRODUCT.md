# Ürünler (Products) - Geliştirilen Kod Açıklaması

Aşağıda proje içindeki `src/pages/Products.jsx` ve `src/components/ProductList.jsx` dosyalarının ne yaptığı, veri şekilleri, hata/kenar durumları ve önerilen geliştirmeler özetlenmiştir.

## Kısa özet

- `Products.jsx`: API'den ürün listesini çeker, yüklenme (loading) durumunu yönetir ve veriyi `ProductList` bileşenine geçirir.
- `ProductList.jsx`: `products` prop'una gelen ürün dizisini işler ve kullanıcıya gösterir (şu an yalnızca başlıkları render ediyor).

---

## `src/pages/Products.jsx` — Nasıl çalışıyor

- Hook'lar:

  - `useState([])`: `loadedProducts` — API'den gelen ürün verilerini tutar.
  - `useState(true)`: `loading` — veri çekme sürecinin devam edip etmediğini tutar.
  - `useEffect(() => { ... }, [])`: bileşen mount edildiğinde (ilk render sonrası) `fetchProducts` fonksiyonunu çalıştırır.

- `fetchProducts` adımları:

  1.  `fetch('http://localhost:5001/products/')` ile ürün listesini çağırır.
  2.  `response.json()` ile yanıtı JS objesine dönüştürür.
  3.  `setLoadedProducts(data)` ile ürünleri state'e atar.
  4.  Hata olursa `catch` içinde `console.log(error)` ile hatayı yazar.
  5.  `finally` içinde `setLoading(false)` ile yüklenme durumunu kapatır.

- Render davranışı:
  - `loading` true ise: `<h1>Loading...</h1>` döndürür.
  - `loading` false ise: `<ProductList products={loadedProducts} />` ile ürünleri listeler.

### Veri şekli (varsayım)

- API'den dönen `data` bir dizi olmalıdır: `[{ id, title, ... }, ...]`.

### İyileştirme fırsatları / dikkat edilmesi gerekenler

- API base URL: `http://localhost:5001` gibi sabitler doğrudan kodda olmamalı; `.env` veya proje yapılandırmasından okunmalı.
- Hata kullanıcıya gösterilmiyor; `error` state'i ekleyip kullanıcıya bildirim vermek gerekir.
- `fetch` isteği iptal edilemiyor (ör. bileşen unmount olursa). `AbortController` ile cleanup önerilir.
- CORS, ağ hataları ve 4xx/5xx durumları için yanıt kontrolü eklenmeli (ör. `if (!response.ok) throw new Error(...)`).
- Daha iyi verim ve cache için React Query / SWR gibi bir kütüphane kullanılabilir.

---

## `src/components/ProductList.jsx` — Nasıl çalışıyor

Mevcut içerik:

```jsx
export default function ProductList({ products }) {
  return <div>{products.map((p) => p.title)}</div>;
}
```

- `products` prop'unu bekler ve `products.map((p) => p.title)` ile dizideki her ürünün `title` alanını alır.

### Mevcut sorunlar ve küçük eksiklikler

- JSX içinde `products.map(...)` doğrudan string dizisi döndürüyor; bu durum sayfada ürün başlıkları `,` ile ayrılmış tek bir string gibi görünebilir ve erişilebilir/tasarımsal açıdan zayıftır.
- `map` ile oluşturulan elemanlara `key` atanmalı: `products.map(p => <div key={p.id}>{p.title}</div>)`.
- Eğer `products` undefined/null ise bileşen hata verebilir — güvenli bir kontrol veya varsayılan prop (`products = []`) yapılmalı.

### Önerilen daha iyi implementasyon örneği

- Basit ama daha doğru render:

```jsx
export default function ProductList({ products = [] }) {
  return (
    <div>
      {products.length === 0 ? (
        <p>Ürün bulunamadı.</p>
      ) : (
        products.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </div>
  );
}
```

---

## Küçük bir "sözleşme" (contract)

- Girdi: `ProductList` bileşeni `products` prop'u olarak bir dizi nesne alır. Her nesnede tercihen `id` ve `title` alanları bulunur.
- Çıktı: Bileşen DOM içinde ürün başlıklarını listeler.
- Hata modu: Eğer `products` geçerli bir dizi değilse, bileşen boş liste davranışı (`Ürün bulunamadı`) göstermelidir.

## Olası kenar durumları (edge cases)

- Boş dizi: kullanıcıya uygun bir mesaj gösterilmeli.
- Büyük veri seti: performans için sanal listeleme (virtualization) gerekebilir.
- Ağ kesintisi veya hatalı JSON: `Products.jsx` içinde error state'i gösterilmeli.
- Yavaş ağ: daha iyi loading UI (spinner/placeholder) gösterilmeli.

## Test önerileri (hızlı)

- Birim testi (Jest + React Testing Library):
  - `Products.jsx` için: fetch mock'layarak yüklenme durumu ve `ProductList`'e veri geçişi test edilebilir.
  - `ProductList.jsx` için: boş liste, tek öğe ve çoklu öğe durumları test edilmeli; ayrıca `key` kullanımı ve render çıktısı kontrol edilmeli.

## Nasıl çalıştırılır / hızlı deneme

Projeyi yerel olarak çalıştırmak için (önden):

```bash
# bağımlılıkları yükleyin
npm install

# dev sunucuyu başlatın
npm run dev
```

API (ör. `http://localhost:5001/products/`) çalışmıyorsa, `Products.jsx` `fetch` çağrısı hata fırlatır ve kullanıcıya sadece `Loading...` sonrası boş liste gösterilir; bu yüzden backend'in çalıştığından emin olun veya frontend geçici mock veri kullansın.

## Özet - Yapılan değişiklikler ve öneriler

- `Products.jsx`: API çağrısı, loading state, basit hata loglama.
- `ProductList.jsx`: temel render; geliştirilmesi gereken noktalar: elemanlara `key` vermek, boş/dolu durum kontrolü ve daha dikkatli JSX yapısı.

Önerilen sonraki adımlar (küçük ve risksiz):

- `ProductList.jsx`'i önerildiği gibi güncelle (varsayılan `products = []`, `key` kullan, boş mesajı göster).
- `Products.jsx`'e `error` state'i ekle ve `response.ok` kontrolü yap.
- API base URL'ini `.env` ile yönet.
