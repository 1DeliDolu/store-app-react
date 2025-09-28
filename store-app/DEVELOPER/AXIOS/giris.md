# Başlangıç

Axios — tarayıcı ve Node.js için Promise tabanlı, izomorfik (aynı kod tabanı hem tarayıcıda hem Node.js'te çalışır) bir HTTP istemcisidir. Sunucuda native Node.js `http` modülünü; istemci tarafında ise `XMLHttpRequest`/Fetch tabanlı çözümleri kullanır.

## Özellikler
- Tarayıcıda `XMLHttpRequest`/Fetch üzerinden istek gönderme  
- Node.js ortamında `http`/`https` ile istek gönderme  
- Promise tabanlı API  
- İstek / yanıt interceptor'ları ile ara katman ekleme  
- İstek/yanıt verilerini dönüştürme  
- İstekleri iptal etme (örn. `AbortController`)  
- JSON için otomatik dönüşüm  
- XSRF koruması desteği

## Hızlı kurulum

npm:
```bash
npm install axios
```

Yarn:
```bash
yarn add axios
```

pnpm:
```bash
pnpm add axios
```

Bower (eski projeler için):
```bash
bower install axios
```

CDN (tarayıcıda doğrudan kullanmak için):

jsDelivr:
```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

unpkg:
```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

## Kısa örnek

```js
import axios from 'axios';

axios.get('https://api.example.com/data')
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
```

Bu temel bilgilerle Axios'u modern projelerinize kolayca entegre edebilirsiniz.