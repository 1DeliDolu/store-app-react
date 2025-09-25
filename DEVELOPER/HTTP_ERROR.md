# HTTP Error handling — Açıklama ve Kullanım

Bu doküman `App.jsx`, `api/apiClient.js`, `components/Navbar.jsx`, `layouts/Main.jsx` ve `pages/ErrorPage.jsx` dosyalarının HTTP hata yönetimi ve akışını açıklar. Hedef: hataların nasıl yakalandığını, kullanıcıya nasıl bildirildiğini ve nasıl test edileceğini hızlıca anlamak.

## Kısa özet (contract)

- Girdi: Kullanıcı etkileşimleri (ör. `ErrorPage` içindeki butonlara tık) veya uygulamanın API çağrıları.
- Çıktı: Axios istekleri ve sunucudan dönen cevaplar; hata durumlarında kullanıcılara toast bildirimi ve konsolda detaylar.
- Hata modları: HTTP 4xx/5xx status kodlarına göre toast gösterimi ve bazı durumlarda konsola ek bilgi yazma.

---

## `App.jsx`

- Ne yapar: Uygulama rotalarını tanımlar ve `MainLayout` (uygulama genel layout'u) etrafında sarar. `errors` yolu `ErrorPage`'i render eder.
- Önemli noktalar:
  - `createBrowserRouter` ile client-side routing kurulmuş.
  - `MainLayout` içinde `ToastContainer` bulunduğu için toast bildirimleri uygulama genelinde görünür.

Nasıl test edilir:

- Tarayıcıda `/errors` yoluna gidin; ErrorPage butonlarını kullanarak farklı hata çağrılarını tetikleyin.

---

## `src/api/apiClient.js`

- Ne yapar: Axios istemcisini yapılandırır, baseURL ayarlar ve global response interceptor ile HTTP hatalarını yakalar.

- Önemli parçalar:
  - `axios.defaults.baseURL = "http://localhost:5001/";` — tüm istekler bu kök adresine göre yapılır.
  - `interceptors.response.use(success, error)` — hata tarafında `error.response` içinden `data` ve `status` çıkarılır ve duruma göre `toast.error` çağrılarak kullanıcıya bildirim gösterilir.
  - `switch(status)` bloklarıyla 400/401/403/404/500 statülerine özel işlem yapılıyor (toast ve bazı durumlarda `console.log` ile detay).
  - `methods` nesnesi küçük wrapper fonksiyonları sağlar: `get`, `post`, `put`, `delete` — hepsi `.then(response => response.data)` döner.
  - `errors` nesnesi: test amaçlı birkaç endpoint çağrısı (`errors/bad-request`, `errors/unauthorized`, vs.) — her biri `.catch(error => console.log(error))` ile çağıranı devirir.
  - `export default requests;` — `products` ve `errors` koleksiyonlarını dışa verir.

Davranış / Notlar:

- Interceptor hata tarafında `return Promise.reject(error.message);` yapılıyor — burada `error.message` yerine `error` veya `error.response` döndürmek, çağıran kodun daha fazla bilgi görmesi açısından daha faydalıdır.
- Eğer `error.response` tanımsızsa (ağ hatası gibi) kod hata verebilir; interceptor içinde `if (!error.response) { toast.error('Network error'); return Promise.reject(error); }` gibi bir kontrol eklemek güvenli olur.

Test etme:

- Backend çalışırken (server dizini içinde) /errors/\* endpointlerini çağırın veya `ErrorPage` butonlarını kullanın.

Geliştirme önerileri:

- Ortak bir toast helper (örn. `src/utils/toast.js`) kullanın, böylece tüm toast konfigürasyonu tek yerde olur.
- Interceptor'da `return Promise.reject(error);` kullanın ve gerektiğinde `error.response`'dan `data.errors` gibi detayları frontend'e iletin.
- Hataları merkezi bir logger/monitoring servisine (Sentry vb.) gönderin (opsiyonel).

---

## `src/components/Navbar.jsx`

- Ne yapar: Üst navigasyon çubuğunu (AppBar) render eder; `links` ve `authLinks` dizilerini haritalayarak `NavLink`/`Link` ile navigasyon butonları oluşturur. Sağ tarafta sepet ikonu (`Badge`) ve auth linkleri bulunur.

- İlişki hata yönetimi ile:
  - Navbar doğrudan hata yönetimiyle ilişkili değil ama `MainLayout` içinden gelen `ToastContainer` sayesinde gösterilen toast'lar her sayfada görünür.

Notlar:

- `react-router` paketinden `Link`/`NavLink` kullanılmış — projenizde `react-router-dom` yüklüyse bu da çalışmalı (kütüphane sürümlerine göre import şekline dikkat edin).

---

## `src/layouts/Main.jsx`

- Ne yapar: Uygulama genel layout'u — `ToastContainer`'ı yerleştirir, `Navbar`'ı gösterir ve `Outlet` ile alt rotaları render eder. Ayrıca `react-toastify` CSS importu olmalıdır (sizin dosyada mevcut).

- Neden önemli: `ToastContainer` uygulama kökünde olduğu için `apiClient`'in interceptöründe çağrılan `toast.error(...)` metodları kullanıcı tarafından görülebilir.

Kontrol listesi:

- `import 'react-toastify/dist/ReactToastify.css';` importu eklenmiş olmalı (stil olmadan toast düzgün görünmeyebilir).
- `ToastContainer` konfigürasyonu (`position`, `theme`, `autoClose` vb.) merkezi olarak burada ayarlanır.

---

## `src/pages/ErrorPage.jsx`

- Ne yapar: Hataları test etmek için bir UI sağlar. Her buton backend'deki farklı hata endpoint'lerini çağırır. Örnek butonlar:

  - Bad Request -> `requests.errors.get400Error()`
  - UnAuthorized -> `requests.errors.get401Error()`
  - Validation Error -> `requests.errors.get403Error()`
  - Not Found -> `requests.errors.get404Error()`
  - Server Error -> `requests.errors.get500Error()`

- Davranış: `apiClient`'in interceptor'ı yakalar ve `toast.error(data.message)` ile mesaj gösterir; bazı statuslarda `console.log` ile detaylar yazılır.

Test etme:

- Backend (server) çalışıyor olmalı (`server` klasöründeki server.js). Ardından tarayıcıdan `/errors` sayfasına gidip butonlara tıklayın. Her butonda toast mesajı görünmeli.

Edge case'ler / dikkat edilmesi gerekenler:

- Eğer backend farklı portta (örn. 5000 vs 5001) çalışıyorsa `axios.defaults.baseURL`'i güncelleyin.
- Ağ hatası (sunucu kapalı veya CORS) durumunda `error.response` olmayabilir; interceptor bu durumu sağlam şekilde ele almalı.

---

## Hızlı adımlar — hata akışını doğrulama

1. Backend'i başlatın (server klasörü):

```bash
npm --prefix server start
```

2. Frontend'i başlatın:

```bash
npm run dev
```

3. Tarayıcıda `http://localhost:3001/` (veya Vite'in çıktısında görülen port) açın, `/errors` sayfasına gidin.
4. Her butona tıklayın ve `react-toastify` aracılığıyla kullanıcıya düşen hata mesajlarını doğrulayın.

## Özet ve öneriler

- Kodunuzda hata yakalama merkezi (axios interceptor) ve kullanıcı bildirimi (toast) zaten kurulmuş; bu mimari iyi.
- Küçük iyileştirmeler:
  - Interceptor'da `error.response` null kontrolü ekleyin.
  - `Promise.reject(error)` döndürün (error.message yerine) ki daha zengin hata bilgisi çağırana ulaşsın.
  - Ortak bir toast helper modülü oluşturun.

Eğer isterseniz bu dokümana örnek screenshot, bir `src/utils/toast.js` helper ya da interceptor'da önerilen değişiklikleri uygulayan bir patch ekleyebilirim.
