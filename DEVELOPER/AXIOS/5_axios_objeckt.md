# Axios Örneği

Aşağıda, Axios ile özel bir örnek (instance) oluşturma ve kullanma için modern ve okunabilir bir rehber bulunmaktadır.

## Örnek Oluşturma
Özel konfigürasyon ile yeni bir Axios örneği oluşturabilirsiniz:

```js
// axios.create([config])
const instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});
```

## Kullanılabilir Metotlar
Axios örneği şu yardımcı metotları sağlar; sağlanan istek konfigürasyonu örnek konfigürasyonu ile birleştirilir:

- `instance.request(config)`
- `instance.get(url[, config])`
- `instance.delete(url[, config])`
- `instance.head(url[, config])`
- `instance.options(url[, config])`
- `instance.post(url[, data[, config]])`
- `instance.put(url[, data[, config]])`
- `instance.patch(url[, data[, config]])`
- `instance.getUri([config])`

## Konfigürasyon Objesiyle Doğrudan Çağırma
`instance.get()` veya `instance.post()` gibi yöntemlerin yanı sıra, örneği doğrudan bir konfigürasyon objesiyle de çağırabilirsiniz. `axios(config)` ile aynı şekilde çalışır ve özellikle orijinal konfigürasyonla isteği tekrar göndermek istediğiniz durumlar için kullanışlıdır.

```js
const instance = axios.create({ baseURL: '/api' });

// axios(config) gibi çalışır
instance({
    url: '/users',
    method: 'get'
});
```

## Örnek: Token Yenileme için Retry Mantığı
Özellikle kimlik doğrulama hatalarında temiz bir "retry" dizaynı kurmak için interceptor kullanabilirsiniz:

```js
instance.interceptors.response.use(
    undefined,
    async (error) => {
        if (error.response?.status === 401) {
            await refreshToken();                // token yenileme işlemi
            return instance(error.config);       // orijinal isteği tekrar gönder
        }
        throw error;
    }
);
```

Bu yapı, merkezi konfigürasyon ve tekrar denemeleri yönetmeyi kolaylaştırır.