# Axios API'si

## Axios API Referansı

Axios çağrıları uygun bir konfigürasyon ile oluşturulur.

### Genel kullanım

```js
axios(config)
```

Örnek — POST isteği:

```js
axios({
    method: 'post',
    url: '/user/12345',
    data: {
        firstName: 'Efe',
        lastName: 'Ceylan'
    }
});
```

Node.js ile uzak sunucudan fotoğraf indirip kaydetme (stream):

```js
axios({
    method: 'get',
    url: 'http://bit.ly/2mTM3nY',
    responseType: 'stream'
})
    .then(function (response) {
        response.data.pipe(fs.createWriteStream('muslum_gurses.jpg'));
    });
```

Kısa kullanım:

```js
axios(url[, config])
// Varsayılan olarak GET isteği gönderir
axios('/user/12345');
```

## Takma ada sahip metotlar

Tüm HTTP istek metotları için kolay kullanım sağlayan takma adlar:

```js
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
axios.postForm(url[, data[, config]])
axios.putForm(url[, data[, config]])
axios.patchForm(url[, data[, config]])
```

**Not:** Bu kolay metotları kullanırken `url`, `method` ve `data` özelliklerini konfigürasyonda tekrar belirtmeye gerek yoktur.