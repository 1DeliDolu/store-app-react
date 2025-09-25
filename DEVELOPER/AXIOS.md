# Axios - Proje İçin Rehber ve Örnekler

Bu belge projede HTTP istekleri için kullanılan Axios kütüphanesinin nasıl konfigüre edileceğini, iyi uygulamaları, hata yönetimini ve örnek kullanım şeklini açıklar. Amaç: `src/api/apiClient.js` gibi bir client oluştururken tutarlı ve güvenli bir yapı sağlamaktır.

## Neden `axios.create` kullanmalıyız?

- `axios.create()` ile bir client instance'ı oluşturmak, global `axios.defaults`'a doğrudan yazmaktan daha güvenlidir:
  - Birden fazla API host'u veya farklı zaman aşımlarına ihtiyaç duyarsanız kolayca ek client tanımlarsınız.
  - Test etmesi ve mock'laması daha kolaydır (ör. jest ile client mock).

Örnek:

```js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // ms
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

export default client;
```

## Konfigürasyon (kısa)

- baseURL: Ortak API kökü. Vite kullanıyorsanız `import.meta.env.VITE_API_BASE` kullanın.
- timeout: Ağ bekleme süresi (ms).
- headers: Global veya istek bazlı başlıklar (Authorization, Content-Type).
- responseType: json, blob, text vb.
- withCredentials: cross-site cookie/credential gönderimi.

## Interceptors — Response ve Error davranışı

- Response interceptor'da genelde ham `response` veya `response.data` döndürülür. Hata durumunda `Promise.reject(error)` döndürün; sadece `error.message` döndürmek, status, headers ve server response verilerini kaybeder.

Örnek:

```js
client.interceptors.response.use(
  (response) => response, // veya response.data
  (error) => {
    // merkezi logging / Sentry burada çalıştırılabilir
    // hata objesini değiştirip yeniden fırlatmak ok
    return Promise.reject(error);
  }
);
```

## Methods helper (kısa ve temiz kullanım)

```js
const methods = {
  get: (url, config) => client.get(url, config).then((r) => r.data),
  post: (url, body, config) =>
    client.post(url, body, config).then((r) => r.data),
  put: (url, body, config) => client.put(url, body, config).then((r) => r.data),
  delete: (url, config) => client.delete(url, config).then((r) => r.data),
};

const products = {
  list: (config) => methods.get("products", config),
  details: (id, config) => methods.get(`products/${id}`, config),
};

export default { products, client };
```

Bu yapı, çağıran tarafta `await requests.products.list()` kullanmayı basitleştirir.

## İstek iptali / AbortController

- Modern axios (1.x) `signal` parametresini destekler; React `useEffect` içinde `AbortController` kullanarak istek iptali yapabilirsiniz. Bu, bileşen unmount olduğunda veya id değiştiğinde isteklerin sızıntısını önler.

Örnek kullanım:

```js
const controller = new AbortController();
try {
  const data = await requests.products.details(id, {
    signal: controller.signal,
  });
} catch (err) {
  if (err.name === "CanceledError" || err.name === "AbortError") return;
  // diğer hataları işle
}
// cleanup
controller.abort();
```

Not: Eski `CancelToken` API'si deprecated; yeni `signal`/AbortController tercih edilir.

## Hata yönetimi / catch blokları

- Axios hataları üç kaynaktan gelir: `err.response` (sunucu döndü), `err.request` (istek gönderildi ama cevap yok), `err.message` (config/timeout vb.). Aşağıdaki şablonla kullanıcıya uygun mesajlar oluşturun.

```js
try {
  await requests.products.list();
} catch (err) {
  if (err.response) {
    // Sunucu 4xx/5xx döndü
    const status = err.response.status;
    const data = err.response.data;
  } else if (err.request) {
    // isteğe cevap gelmedi (network)
  } else {
    // config hatası
  }
}
```

Interceptor içinde hata loglarken `error.response?.data` veya `error.response?.status`'ı kullanmak faydalıdır.

## Örnek: `Products.jsx` kullanım (component tarafı)

```jsx
import { useEffect, useState } from "react";
import requests from "../api/apiClient";
import Loading from "../components/Loading";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await requests.products.list({
          signal: controller.signal,
        });
        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Ürünler yüklenemedi.</div>;
  return <ProductList products={products} />;
}
```

## Örnek: `ProductDetails.jsx` kullanım

```jsx
useEffect(() => {
  const controller = new AbortController();
  async function fetchDetails() {
    try {
      const data = await requests.products.details(id, {
        signal: controller.signal,
      });
      setProduct(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  fetchDetails();
  return () => controller.abort();
}, [id]);
```

## Environment / Güvenlik

- API base URL ve hassas token'ları `.env` (Vite: `.env`, `.env.local`) içinde `VITE_` prefix ile saklayın:

```
VITE_API_BASE=https://api.example.com
VITE_API_KEY=...
```

- Kod içinde `import.meta.env.VITE_API_BASE` ile okuyun. Hassas verileri doğrudan kaynak kodda saklamayın.

## Logging ve monitoring

- Interceptor içinde merkezi logging (console / Sentry) ekleyin. Prod ortamında hassas veri loglamamaya dikkat edin.

## Test etme

- `apiClient`'ı mocklamak için jest ve axios-mock-adapter veya MSW (Mock Service Worker) kullanabilirsiniz. `axios.create` kullanmak client'ı mock'lamayı kolaylaştırır.

## Performans ve retry

- Kritik istekler için retry stratejisi (exponential backoff) eklenebilir. Bunun için axios-retry gibi kütüphaneler kullanılabilir.

## Özet - Pratik kurallar

1. `axios.create` ile client oluşturun ve `baseURL`'yi env'den alın.
2. Interceptor içinde `Promise.reject(error)` kullanın — sadece `error.message` dönmeyin.
3. React bileşenlerinde `AbortController` (signal) kullanarak istekleri iptal edin.
4. Hata objesini `err.response?.status` / `err.response?.data` ile ayrıştırın.
5. Test/CI için client'ı kolay mock'lanır yapın.

Bu dökümanı isterseniz kısa bir 'kod snippet' seti ile `DEVELOPER/AXIOS_SNIPPETS.md` olarak da kaydederim; yoksa buradaki örnekler temel kullanım için yeterlidir.
