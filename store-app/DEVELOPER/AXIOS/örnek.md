# Basit Örnek

Axios kullanımı için kısa bir rehber.

## CommonJS (TypeScript intellisense ile)
CommonJS `require()` kullanıyorsanız, TypeScript/IDE otomatik tamamlama (intellisense) için aşağıdaki şekilde import edebilirsiniz:

```js
const axios = require('axios').default;
```

Bu şekilde `axios.<method>` otomatik tamamlama ve parametre bilgileri sağlar.

## GET isteği — Promise tabanlı
```js
const axios = require('axios');

axios.get('/user?ID=12345')
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        // her koşulda çalıştırılır
    });
```

Aynı isteği `params` nesnesiyle de gönderebilirsiniz:
```js
axios.get('/user', {
    params: { ID: 12345 }
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

## async/await örneği
```js
async function getUser() {
    try {
        const response = await axios.get('/user?ID=12345');
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
```

NOT: `async/await` ECMAScript 2017 özelliğidir. Eski tarayıcılar (ör. Internet Explorer) doğrudan desteklemeyebilir — gerekiyorsa transpile (Babel/TypeScript) veya polyfill kullanın.
