# Not Found & Error Pages — Açıklama (kolay okunacak özet)

Bu dosya `App.jsx`, `src/api/apiClient.js`, `src/pages/errors/NotFound.jsx` ve `src/pages/errors/ServerError.jsx` dosyalarının Not Found (404) ve Server Error (500) akışındaki rollerini, nasıl test edileceğini ve geliştirme önerilerini kısa ve öz olarak açıklar.

## Küçük kontrat

- Girdi: Kullanıcının tarayıcı URL'si veya API çağrılarından dönen hata yanıtları.
- Çıktı: Kullanıcıya uygun hata sayfası gösterimi (NotFound veya ServerError) ve gerektiğinde router.navigate ile yönlendirme.
- Hata modları: 404 -> NotFound, 500 -> ServerError (state ile detay iletilebilir).

---

## `App.jsx`

- Ne yapar: Uygulamanın router'ını build eder ve ana rotaları tanımlar. Önemli kısımlar:
  - `/errors` alt rotası içinde `index: Error` (test butonları), `server-error` ve `not-found` sayfaları tanımlı.
  - Global `*` wildcard rota ile bilinmeyen yollar `NotFoundPage`'e yönlendiriliyor.
  - `export const router = createBrowserRouter([...])` şeklinde `router`'ın dışa açılması, diğer modüllerden (ör. interceptor) programatik navigasyon yapılmasına olanak sağlar.

Nasıl test edilir:

- Tarayıcıda bilinmeyen bir route açın (ör. `/some/random/path`) -> NotFound sayfası gösterilmeli.

Öneri:

- Router'ı doğrudan başka modüllere import etmek bazen circular import sorunlarına yol açabilir; eğer bu tür hatalar görürseniz navigation helper (ayrıca export edilen küçük fonksiyon) kullanmayı düşünün.

---

## `src/api/apiClient.js`

- Ne yapar: Axios'ı yapılandırır, baseURL ayarlar ve response interceptor içinde hata durumlarını yakalar.
- NotFound (404) ilişkisi:
  - Interceptor'da 404 geldiğinde `toast.error(data.message)` çağrısı yapılır; bazı projelerde 404 özel davranış (ör. router.navigate('/errors/not-found', { state: {...} })) tercih edilebilir.
- Server Error (500) ilişkisi:
  - Mevcut yapı `case 500:` durumunda `router.navigate('/errors/server-error', { state: { error: data, status } })` çağrısı yapıyor. Böylece detaylar `ServerError` sayfasına aktarılıyor.

Geliştirme önerileri:

- Interceptor içinde önce `if (!error.response) { toast.error('Network error'); return Promise.reject(error); }` kontrolü ekleyin.
- `return Promise.reject(error.message)` yerine `return Promise.reject(error)` kullanılması çağıran komponentin daha fazla bilgi almasını sağlar.
- 404 için istenirse otomatik `/errors/not-found` yönlendirmesi ekleyebilirsiniz; şu an 404 sadece toast gösteriyor.

---

## `src/pages/errors/NotFound.jsx`

- Ne yapar: Kullanıcı bilinmeyen bir sayfaya gittiğinde gösterilen Not Found sayfasıdır.
- İçerik:
  - Başlık (`Not Found Error`) ve bir `Alert` ile kullanıcıya bilgi verir.
  - `Anasayfa` butonu ile kullanıcıyı ana sayfaya yönlendirir.

Nasıl test edilir:

- Tarayıcıda bilinmeyen bir yol açın (ör. `/does-not-exist`) veya router üzerinden programatik olarak wildcard rotaya yönlendirin.

Öneri:

- Eğer 404'leri backend'den detaylı bir `message` ile alıyorsanız, `useLocation()` ile gelen `state`'i kontrol edip backend mesajını gösterebilirsiniz. Bu, kullanıcıya daha spesifik bilgi verir.

---

## `src/pages/errors/ServerError.jsx`

- Ne yapar: Backend'den dönen 500 Internal Server Error durumunda kullanıcıya detaylı bilgi gösterir.
- Davranış:
  - `useLocation()` ile router state'deki `error` objesini okur.
  - Eğer `state?.error` varsa başlıkta `state.error.message` ve status gösterilir; Alert içinde `state.error.details` gösterilir (veya fallback mesaj).
  - Eğer `state` yoksa fallback bir 'Server Error' ekranı gösterilir.

Bulunan küçük hata:

- Fallback branch içinde `Alert` bileşeninde `security="error"` gibi bir yazım hatası görülebilir; MUI için doğru prop `severity` olmalıdır. Bu dosyada bunu düzeltmeyi düşünün.

Test etme:

- Backend çalışırken `Error` test sayfasındaki "Server Error" butonunu tıklayın. Beklenen akış:
  1.  Frontend `GET /errors/server-error` isteği atar.
  2.  Backend 500 döner.
  3.  Axios interceptor `router.navigate('/errors/server-error', { state: { error: data, status } })` ile kullanıcıyı `ServerError` sayfasına yönlendirir.
  4.  `ServerError.jsx` sayfası hata mesajını ve detayları gösterir.

Geliştirme önerileri:

- ServerError sayfasını kopyalanabilir bir detay kutusu (copy-to-clipboard) veya bir destek bildirimi (send report) ile zenginleştirin.
- Hata objesinden `requestId` veya `trace` varsa kullanıcıya gösterin; bu, backend ile debug yaparken yardımcı olur.

---

Eğer isterseniz bu dokümana örnek bir `navigation` helper modülü ekleyebilirim ve `apiClient.js`'i daha güvenli hale getiren küçük bir patch uygulayabilirim (null-check + full error reject). Hangi adımı istersiniz?
