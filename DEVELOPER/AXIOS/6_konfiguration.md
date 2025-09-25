# İstek Konfigürasyonu

Aşağıda Axios isteklerinde sık kullanılan, modern ve sadeleştirilmiş konfigürasyon örneği ve açıklamaları yer alır. Yalnızca `url` gereklidir; `method` belirtilmezse varsayılan `GET` olur.

```js
// Örnek konfigürasyon
const config = {
    url: '/user',
    baseURL: 'https://some-domain.com/api',
    method: 'get',           // get, post, put, delete, patch ...
    params: { ID: 12345 },   // URL parametreleri
    data: { firstName: 'Efe' }, // İstek gövdesi (POST, PUT, PATCH, DELETE)
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    timeout: 1000,           // ms cinsinden zaman aşımı
    responseType: 'json',    // 'arraybuffer', 'document', 'json', 'text', 'stream', (browser: 'blob')
    withCredentials: false,  // cross-site Access-Control isteklerinde credentials gönderimi
    auth: { username: 'louis', password: 's00pers3cret' }, // Basic auth
    maxRedirects: 5,
    maxContentLength: 2000,
    maxBodyLength: 2000,
    validateStatus: status => status >= 200 && status < 300,
    // Node.js: httpAgent, httpsAgent, socketPath, proxy vb. eklenebilir
};
```

Önemli seçenekler (kısa açıklama)
- url / baseURL: İsteğin hedefi; `url` mutlak değilse `baseURL` ile birleştirilir.
- method: HTTP metodu (varsayılan 'get').
- params: Query parametreleri; boş/undefined alanlar URL'e eklenmez.
- paramsSerializer: Parametrelerin nasıl serileştirileceğini özelleştirir.
- data: İstek gövdesi (sadece POST/PUT/PATCH/DELETE vb.).
- headers: Özel başlıklar.
- transformRequest / transformResponse: İstek/yanıt verilerini dönüştürmek için fonksiyon dizileri.
- timeout: İstek zaman aşımı (ms).
- responseType / responseEncoding: Yanıt tipi ve kodlaması (kodlama Node.js'te).
- withCredentials: CORS isteklerinde kimlik bilgileri gönderimi.
- onUploadProgress / onDownloadProgress: Tarayıcıda ilerleme olayları.
- auth: HTTP Basic auth için kullanıcı bilgileri (Bearer token'lar için Authorization header kullanın).
- proxy: Proxy sunucu konfigürasyonu veya `false` ile devre dışı bırakma.
- cancelToken: İsteği iptal etmek için kullanılır.
- decompress (Node.js): Yanıt sıkıştırmasının açılıp açılmayacağı.

İyi uygulamalar
- Büyük veya hassas veriler için uygun `timeout` ve `maxBodyLength` ayarlayın.
- Tarayıcı/Node ortamına göre `responseType`, `responseEncoding`, agent ve proxy ayarlarını kontrol edin.
- Kimlik doğrulama için hassas verileri doğrudan kaynak kodda saklamayın; ortam değişkenlerini kullanın.
- Geliştirme sırasında `transformRequest`/`transformResponse` ile veri doğrulama ve sanitizasyon uygulayın.
- Parametre serileştirmesi gerektiğinde `paramsSerializer` ile tutarlı URL formatı sağlayın.
- Hata durumlarını ele almak için `validateStatus` veya `interceptors` kullanın.
