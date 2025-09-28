# Server Error akışı — yapılan geliştirmeler

Bu doküman, projede sunucu (500) hatalarının nasıl ele alındığını ve hangi dosyaların bu akışta rol oynadığını açıklar. Aşağıdaki dosyalarda yapılan geliştirmeler ve davranışları özetlenmiştir:

- `src/App.jsx`
- `src/api/apiClient.js`
- `src/pages/errors/Error.jsx`
- `src/pages/errors/ServerError.jsx`

## Özet

- Backend'den dönen 500 Internal Server Error durumunda uygulama otomatik olarak `/errors/server-error` rotasına yönlendiriliyor. Yönlendirme sırasında sunucudan gelen hata verisi `state` nesnesi olarak iletiliyor; böylece `ServerError` sayfası hatanın mesajını ve detaylarını gösterebiliyor.

## `App.jsx` — Router export ve hata rotası

- Yapılan: `createBrowserRouter` ile oluşturulan `router` değişkeni `export const router = ...` şeklinde dışa açıldı.
- Neden: `apiClient.js` içinde axios interceptor'dan yönlendirme yapmak için bu router'a erişilmesi gerekiyor.
- Önemli rota:
  - `/errors` — index olarak `Error.jsx` (test butonları)
  - `/errors/server-error` — `ServerError.jsx` (500 hata sayfası)

Not: Router'ı başka bir modülden import etmek işe yarıyor ancak modül yükleme sırasına bağlı dolaylı import/circular import riskleri olabilir. Eğer uygulama başlarken `router` undefined oluyorsa alternatif olarak navigation helper (ör. ayrı bir `navigation.js` modülü veya `window.location`) tercih edilebilir.

## `src/api/apiClient.js` — Interceptor ile yönlendirme

- Yapılan: Axios interceptor'ı 500 hatası geldiğinde `router.navigate('/errors/server-error', { state: { error: data, status } })` çağrısı yapacak şekilde güncellendi.
- Davranış:
  - `axios.defaults.baseURL` backend adresine ayarlı (ör. `http://localhost:5001/`).
  - Interceptor `error.response` içindeki `data` ve `status` değerlerini kullanır.
  - Status 500 olduğunda frontend, router kullanarak server error sayfasına yönlendirir ve hata nesnesini state ile iletir.

Öneriler / dikkat edilecekler: - Interceptor içinde `error.response` yoksa (network error / CORS / server kapalı) kod hata verebilir; bu yüzden önce `if (!error.response) { toast.error('Network error'); return Promise.reject(error); }` gibi bir kontrol eklemek güvenli olacaktır. - Şu an interceptor `return Promise.reject(error.message);` döndürüyor; daha zengin hata bilgisi için `return Promise.reject(error);` veya `Promise.reject(error.response)` tercih edilebilir. - Router importu modül bağımlılıklarını (import order) etkileyebilir; eğer sorun yaşanırsa yönlendirme için ayrı bir navigation helper oluşturun.

## `src/pages/errors/Error.jsx` — Hata test butonları

- Yapılan: Hata durumlarını tetiklemek için UI butonları (Bad Request, UnAuthorized, Validation Error, Not Found, Server Error) mevcuttur. Her buton `requests.errors.<endpoint>` çağrısını yapar.
- Davranış:
  - Butonlara tıklandığında `apiClient` üzerinden ilgili `/errors/*` endpoint'ine istek gider.
  - Eğer endpoint 500 dönerse interceptor yukarıda belirtildiği şekilde yönlendirme yapar.

## `src/pages/errors/ServerError.jsx` — Hata gösterimi

- Yapılan: `useLocation()` ile gelen `state`'deki hata nesnesi okunuyor ve kullanıcıya gösteriliyor.
  - Eğer `state.error` varsa:
    - Başlıkta `state.error.message` ve `state.status` gösteriliyor.
    - Alert içinde `state.error.details` (varsa) veya fallback mesaj gösteriliyor.
  - Eğer `state` boşsa fallback bir 'Server Error' sayfası gösteriliyor.

Bulunan küçük hata ve düzeltme:

- Orijinal dosyada fallback Alert bileşeninde `security="error"` gibi bir yazım hatası vardı; doğru prop `severity` olmalıdır. Bu repository içinde düzeltildi.

## Test adımları (hızlı)

1. Backend'i başlatın:

```bash
npm --prefix server start
```

2. Frontend'i çalıştırın:

```bash
npm run dev
```

3. Tarayıcıda `/errors` sayfasına gidin.
4. "Server Error" butonuna tıklayın. Beklenen sonuç:
   - Backend 500 cevabı döner.
   - Frontend interceptor `router.navigate('/errors/server-error', { state: { error: data, status } })` ile yönlendirir.
   - `/errors/server-error` sayfasında hata mesajı ve detaylar gösterilir.

## Önerilen iyileştirmeler

- Interceptor'da `error.response` null kontrolü ekleyin.
- `return Promise.reject(error);` ile daha kapsamlı hatayı çağırana verin.
- Router navigasyonu için ayrı, küçük bir `navigation` modülü (örn. export edilen `navigate` fonksiyonu) oluşturun; bu, circular import riskini azaltır.
- ServerError sayfasını daha zengin hale getirin: hata trace, request-id, kullanıcı dostu geri bildirim, ve opsiyonel olarak Sentry gibi bir hata izlemesine gönderim.

Bu dosyayı referans alarak isterseniz interceptor'u hemen güncelleyebilirim (null-check + full-error reject) veya `ServerError.jsx`'e ekstra alanlar ekleyebilirim.
