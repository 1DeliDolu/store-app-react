# Validation Errors — Detaylı Açıklama

Bu doküman `src/api/apiClient.js` içindeki axios interceptor'ının 403 (validation error) durumunu nasıl ele aldığını ve `src/pages/errors/Error.jsx` bileşeninin bu hatayı nasıl yakalayıp kullanıcıya nasıl gösterdiğini adım adım açıklar. Ayrıca beklenen server response şekli, mevcut transformasyon, kenar durumları ve iyileştirme önerileri yer alır.

## 1) Beklenen backend response (örnek)

Genellikle validation error backend'ten şu tip bir JSON ile döner:

```json
{
  "message": "Validation failed",
  "errors": {
    "title": ["Title is required"],
    "price": ["Price must be greater than 0"]
  }
}
```

Burada `errors` nesnesi, alan isimlerini anahtar olarak tutar ve her anahtar bir dizi (array) hata mesajı içerir.

## 2) `apiClient.js`'deki davranış (mevcut kod)

- Axios response interceptor'ında hata branch'inde `const { data, status } = error.response;` alınıyor.
- `case 403:` içinde:
  - Eğer `data.errors` varsa, kod şu işlemleri yapar:
    1. `errors` adında boş bir dizi oluşturur.
    2. `for (const key in data.errors) { errors.push(data.errors[key]); }` ile `data.errors` içindeki her değeri `errors` dizisine push eder.
    3. `let result = { errors: errors, message: data.message };` oluşturarak bu `result` nesnesini `throw result;` ile fırlatır.

Bu noktada interceptor, axios çağrısını `throw` ile sonlandırdığından, çağıran taraftaki `.catch(...)` bloğu bu `result` nesnesini alır.

Not: `data.errors[key]` genellikle bir dizi olduğundan `errors` dizisi, örneğin `[ ["Title is required"], ["Price must be greater than 0"] ]` gibi bir yapı alır (yani iç içe diziler).

## 3) `src/pages/errors/Error.jsx`'deki kullanım

- Bileşen, `useState` ile `validationError` state'i tutar.
- `getValidationErrors()` fonksiyonu `requests.errors.get403Error().catch((data) => { setValidationError(data); });` çağrısını yapar.
  - Önemli: `requests.errors.get403Error()` axios istek wrapper'ı olan `methods.get('errors/validation-error')` döner — interceptor tarafından fırlatılan `result` burada catch'e gider ve `data` parametresi olarak alınır.
- Render kısmı:
  - Eğer `validationError && validationError.errors` varsa, `Alert` içinde `validationError.message` gösterilir ve `validationError.errors.map((error, index) => ( <ListItemText>{error}</ListItemText> ))` ile liste render edilir.

Bu kullanım `validationError.errors`'in düz bir string dizisi olduğu varsayımıyla çalışır. Ancak interceptor'ın mevcut dönüşü iç içe diziler üretebilir (yukarıda bahsedildiği gibi), bu durumda ListItemText içinde gösterilen `error` değeri bir array olur ve beklenmedik görüntü veya `toString()` sonucu ortaya çıkabilir.

## 4) Örnek akış (adım adım)

1. Kullanıcı Error sayfasında "Validation Error" butonuna tıklar.
2. `getValidationErrors()` çağrılır ve `requests.errors.get403Error()` istek atar.
3. Backend 403 döner ve body yukarıdaki örneğe benzer yapıda gelir.
4. Interceptor `case 403`'de `result` nesnesini `throw` eder; çağıran `.catch` bloğu bu nesneyi alır.
5. `setValidationError(data)` ile `validationError` state'i örneğin `{ errors: [ ["Title is required"], ["Price must be greater than 0"] ], message: 'Validation failed' }` değerini alır.
6. UI `validationError.errors.map(...)` ile her `error`'ı render etmeye çalışır; fakat `error` bir array olduğundan görsel olarak doğru formatlanmaz.

## 5) Kenar durumlar ve potansiyel hatalar

- `error.response` undefined olabilir (network hatası, CORS hatası, sunucu kapalı). Mevcut kod direkt `const { data, status } = error.response;` ile hata fırlatır. Interceptor'a `if (!error.response) { toast.error('Network error'); return Promise.reject(error); }` gibi bir kontrol eklemek güvenli olur.
- Interceptor son satırında `return Promise.reject(error.message);` kullanılıyor; `error.message` yalnızca kısa bir stringdir. Çağıranın daha fazla bilgiye erişmesi için `return Promise.reject(error);` veya `Promise.reject(error.response)` gibi daha zengin bir obje döndürülmesi daha iyidir.
- `data.errors` içindeki değerlerin yapılandırılması server tarafında garanti edilmeli; ama frontend tarafında da girdiyi normalize etmek gerekir.

## 6) İyileştirme önerileri (kod örnekleri)

1. Interceptor: null-check ve daha iyi reject

- Değişiklik (öneri):

```js
// ... interceptor error handler başlangıcı
if (!error.response) {
  toast.error("Network error");
  return Promise.reject(error);
}

const { data, status } = error.response;

// 403 handling (normalize edilmiş şekilde)
if (status === 403) {
  if (data.errors) {
    // Flatten and collect messages as strings
    const errors = [];
    for (const key in data.errors) {
      if (Array.isArray(data.errors[key])) {
        data.errors[key].forEach((m) => errors.push(m));
      } else if (typeof data.errors[key] === "string") {
        errors.push(data.errors[key]);
      }
    }

    const result = { errors, message: data.message || "Validation error" };
    return Promise.reject(result); // reject with normalized object
  }
}

// diğer statusler ...

return Promise.reject(error);
```

Bu kod `errors` dizisini tek boyutlu (string listesi) yapar; böylece `Error.jsx`'de doğrudan `errors.map(...)` ile güvenle render edilir.

2. `Error.jsx`'de hata yakalama ve gösterim örneği

- Değişiklik (öneri):

```js
function getValidationErrors() {
  requests.errors
    .get403Error()
    .then(() => {})
    .catch((err) => {
      // err burada interceptor tarafından reject edilen normalize obje olmalı
      // eğer err === error (axios hatası) ise fallback göster
      if (err && err.errors) {
        setValidationError(err);
      } else if (err && err.response && err.response.data) {
        // eski yapı: normalize et
        const resp = err.response.data;
        // ... normalize as above
      }
    });
}

// Render kısmında:
{
  validationError && validationError.errors && (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>{validationError.message}</AlertTitle>
      <List>
        {validationError.errors.map((msg, i) => (
          <ListItem key={i}>
            <ListItemText>{msg}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Alert>
  );
}
```

Bu yaklaşımda `validationError.errors` tek boyutlu string dizisi olduğundan UI doğru görünür.

3. Alternatif: interceptor `throw` yerine `return Promise.reject(...)` kullansın.

- Neden: `throw` interceptor içinde de benzer etkiyi yapar, ancak `return Promise.reject(obj)` daha açık bir intent sağlar ve bazı Promise zincirlerinde daha öngörülebilir davranır.

## 7) Özet (Quick checklist)

- Backend response shape doğrula: `message` ve `errors` objesi bekleniyor.
- Interceptor içinde:
  - `if (!error.response)` kontrolü ekle
  - `403` durumunda `errors`'ı flatten edip string dizisi yap
  - `return Promise.reject(normalizedError)` ile reddet
- `Error.jsx`'de `.catch` içinde hem normalizedError hem de fallback axios error handling yap
- Test: Butona tıkla -> validation error dön -> hata UI'da düzgün listelensin

Eğer isterseniz bu repo için küçük bir patch hazırlayıp interceptor'ı yukarıdaki şekilde güncelleyebilirim ve `Error.jsx`'i ona göre revize edebilirim. Hemen uygulamamı ister misiniz?
