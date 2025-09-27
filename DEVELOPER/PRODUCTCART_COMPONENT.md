# ProductCard / ProductList / formats.js - Detaylı Açıklama

Bu doküman `src/components/ProductCard.jsx`, `src/components/ProductList.jsx` ve `src/utils/formats.js` dosyalarının ne yaptığı, beklenen veri şekilleri, olası hata/kenar durumları ve önerilen geliştirmeleri açıklar.

## Kısa özet

- `ProductList.jsx`: API'den gelen `products` dizisini alır ve her ürün için `ProductCard` bileşenini bir grid içinde render eder.
- `ProductCard.jsx`: Tek bir ürünün kart görünümünü sağlar — görsel, başlık, fiyat ve aksiyon butonları (favori, sepete ekle).
- `formats.js`: Uluslararasılaştırma (Intl) kullanarak TRY formatlayıcı (`currenyTRY`) export eder.

---

## Veri şekli (expected shapes)

- ProductList'e gelen prop:

  - `products`: Array of objects

- Tek bir ürün objesi örneği (varsayım):

  {
  id: number | string,
  title: string,
  price: number,
  image: string, // dosya adı veya URL
  ...diğer alanlar
  }

ProductCard, yukarıdaki alanların en az `id`, `title`, `price` ve `image` alanlarının varlığını bekler.

---

## `src/components/ProductList.jsx` — Açıklama ve dikkat edilmesi gerekenler

- Sorumluluk: `products` dizisini alıp grid düzeninde `ProductCard`'ları render etmek.
- Önemli noktalar:
  - `key={p.id}` kullanımı doğru ve React performansı için gerekli (ancak `id` her zaman benzersiz olmalı).
  - Kodda kullanılan Grid bileşeni (`Grid` veya `Grid`) MUI sürümüne göre doğru import edilmelidir:
    - Eğer projenizde MUI v5 ve `Grid` kullanılıyorsa doğru import genellikle `import Grid from '@mui/material/Unstable_Grid';` şeklindedir.
    - Alternatif ve stabil seçenek `import Grid from '@mui/material/Grid';` ve `item`, `xs`, `md`, `lg` prop'larını kullanmaktır.
  - `products` null/undefined olursa `products.map` runtime hatası verir. Güvenli kullanım için `products = []` veya çağıran tarafın garanti etmesi gerekir.

Öneriler: - `products` için default parametre: `function ProductList({ products = [] })`. - Boş liste durumunda kullanıcıya mesaj göster: "Ürün bulunamadı". - Grid kullanımında `item` prop'u ve responsive sütun değerleri (`xs`, `md`, `lg`) açık kullanılmalı.

---

## `src/components/ProductCard.jsx` — Açıklama ve geliştirme notları

- Sorumluluk: Tek bir ürünün kart görünümünü sağlamak. Mevcut UI ögeleri:
  - `CardActionArea` (tıklanabilir alan) içinde ürün görseli (`CardMedia`) ve metin (`CardContent`).
  - Görsel URL'i: `http://localhost:5001/images/${product.image}` (backend'den görüntü dosya adı bekleniyor).
  - Başlık: `product.title`.
  - Fiyat: `currenyTRY.format(product.price)` ile yerel TRY biçiminde gösterim.
  - Aksiyonlar: favori ikonu (`FavoriteBorderIcon`) ve "Sepete Ekle" butonu.

### Kenar durumları ve hatalar

- `product.image` eksik veya yanlışsa `CardMedia` bozuk görsel gösterir; fallback (placeholder) resim eklenmeli.
- `product.price` yoksa `currenyTRY.format(undefined)` hata vermez fakat `NaN`/`undefined` gibi beklenmedik çıktı olabilir — ön kontrol yapılmalı.
- `Link` importu: projenizde `react-router` mı yoksa `react-router-dom` mu kullanıldığı tutarlı olmalı. Genelde tarayıcı uygulamalarında `Link` `react-router-dom`'dan import edilir.

### Erişilebilirlik ve SEO

- `CardMedia`'ya `alt` veya semantik açıklama eklenmeli (ör. `aria-label` veya `alt` attribute yoksa ekran okuyucu kullanıcıları görsel içeriği kaçırır).
- Başlık `h2`/`h3` gibi doğru semantik öğe ile işaretlenmış, fakat `CardActionArea` içindeki link için `aria-label` eklenmesi tercih edilir.

### İyileştirme önerileri

- Resim yükleme hatası için `onError` ile fallback görsel kullanılabilir.
- Sepete ekle butonunu fonksiyonel hale getirmek: global sepet state'ine (Context/Redux/Zustand) bağlanmalı.
- Favori butonu için toggle davranışı uygulanmalı (ikon değişimi ve küçük animasyon).
- `Button` ve `IconButton` için `aria-label` ve test-id ekleyin.
- `currenyTRY` kullanımı doğru; ancak `formats.js` içindeki `currenyTRY` yazımında bir yazım hatası (typo) var: `currenyTRY` yerine `currencyTRY` daha okunaklı olur. Mevcut isim değişikliği yapılırsa tüm importlar güncellenmeli.

---

## `src/utils/formats.js` — Açıklama

- İçerik:

```js
export const currenyTRY = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});
```

- `Intl.NumberFormat` ile para birimi biçimlendiricisi oluşturulmuş. `currenyTRY.format(product.price)` ile `123.45` -> `₺123,45` (locale'ye bağlı) gibi bir çıktı alınır.

### Öneriler

- İsimlendirme düzeltmesi (`currencyTRY`) tavsiye edilir; alternatif olarak fonksiyon halinde `formatTRY(amount)` oluşturup `undefined`/`null` durumlarına `—` veya `0 ₺` gibi anlamlı fallback döndürmek daha güvenli olur.

---

## Test önerileri

- `ProductCard`:

  - Görsel url'si render ediliyor mu, başlık text'i doğru mu, fiyat formatı beklenen şekilde mi test edin.
  - Sepete ekle butonuna tıklama halinde beklenen callback çağrılıyor mu (mock store/handler).

- `ProductList`:
  - Boş liste, tek ürün, çoklu ürün durumları testi.
  - Grid hücrelerinin sayısı `products.length` ile eşleşmeli.

---

## Hızlı checklist (hızlı düzeltmeler)

1. `ProductList`'e güvenli default: `function ProductList({ products = [] })`.
2. Grid import sorununu düzelt: eğer `Grid` kullanacaksanız `import Grid from '@mui/material/Unstable_Grid';` veya stabil `Grid` kullanın: `import Grid from '@mui/material/Grid';` + `item` prop.
3. `formats.js` içindeki `currenyTRY` isimlendirme hatasını değerlendirin.
4. `ProductCard` için görsel fallback, `alt`/`aria-label`, ve `price` güvenliği ekleyin.
5. Sepet/favori işlemlerini gerçek state ile bağlayın.

Bu doküman, bileşenlerin nasıl çalıştığını, hangi veri yapısını beklediklerini ve öncelikli iyileştirmeleri kısa ve uygulanabilir şekilde listeler. İsterseniz bu küçük düzeltmeleri (Grid import, default props, fallback görsel) hemen kodda uygulayayım ve hızlıca test edeyim.
