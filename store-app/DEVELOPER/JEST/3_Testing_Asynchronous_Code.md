<!-- navigation top -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="2_Using_Matchers.md">← Önceki</a>
  <span><a href="1_Getting_Started.md">İçindekiler</a></span>
  <a href="4_Setup and Teardown.md">Sonraki →</a>
</div>

# Asenkron Kodları Test Etme — Jest

JavaScript'te birçok şey asenkron çalışır (Promises, async/await, callback'ler). Jest testinizin bitiş zamanını doğru bilir; bunun için doğru yapıyı kullanmanız gerekir. Bu rehber, Promise, async/await, callback ve `.resolves`/`.rejects` kullanım örnekleriyle birlikte pratik ipuçları içerir.


## 1) Promise döndüren fonksiyonlar

Test fonksiyonundan bir Promise döndürürseniz Jest o Promise'in çözülmesini (resolve) veya reddedilmesini (reject) bekler. Promise reddedilirse test başarısız olur.

Örnek:

```js
// fetchData() -> Promise<string>
test("the data is peanut butter", () => {
  return fetchData().then((data) => {
    expect(data).toBe("peanut butter");
  });
});
```

Uyarı: `return` ifadesini unutmayın; aksi hâlde test Promise tamamlanmadan bitebilir.



## 2) Async / Await

Daha okunur testler yazmak için `async`/`await` kullanabilirsiniz. Jest, `async` test fonksiyonunu algılar ve Promise çözüldüğünde testi sonlandırır.

```js
test("the data is peanut butter", async () => {
  const data = await fetchData();
  expect(data).toBe("peanut butter");
});
```

Hata senaryosu örneği:

```js
test("the fetch fails with an error", async () => {
  expect.assertions(1); // en az 1 assertion'ın çağrılacağını garanti eder
  try {
    await fetchData();
  } catch (error) {
    expect(error).toMatch("error");
  }
});
```

`.resolves` ve `.rejects` ile birlikte kullanma:

```js
await expect(fetchData()).resolves.toBe("peanut butter");
await expect(fetchData()).rejects.toMatch("error");
```

> Not: `async/await` temelde Promise tabanlı örüntünün daha temiz bir yazım şeklidir.



## 3) Callback tabanlı API'ler

Eğer test ettiğiniz fonksiyon Promise yerine callback kullanıyorsa, Jest'e testin ne zaman biteceğini `done` callback'i ile bildirirsiniz.

```js
// fetchData(callback)
test("the data is peanut butter", (done) => {
  function callback(error, data) {
    if (error) {
      done(error); // hata ile bitir
      return;
    }
    try {
      expect(data).toBe("peanut butter");
      done(); // başarıyla tamamlandığını bildir
    } catch (err) {
      done(err); // assertion başarısızsa hata bildir
    }
  }

  fetchData(callback);
});
```

Önemli: `done` kullanıyorsanız test fonksiyonunuz bir Promise döndürmemelidir; Jest hem `done` hem Promise görünce hata fırlatır.



## 4) .resolves / .rejects

`expect(...).resolves` ve `expect(...).rejects` matcher'ları, Promise'lerin sonucunu beklemek için kullanışlıdır. Bu durumda `return` veya `await` ile Assertion'ı döndürdüğünüzden emin olun.

```js
// Promise çözülürse
return expect(fetchData()).resolves.toBe("peanut butter");

// Promise reddedilirse
return expect(fetchData()).rejects.toMatch("error");
```

veya `async`/`await` ile:

```js
await expect(fetchData()).resolves.toBe("peanut butter");
await expect(fetchData()).rejects.toMatch("error");
```



## 5) assert sayısı kontrolü — expect.assertions

Asenkron testlerde bazı assertion'ların gerçekten çağrıldığını garantilemek için `expect.assertions(n)` veya `expect.hasAssertions()` kullanın. Bu sayede testin sessizce geçtiği hatalı durumları yakalarsınız.

```js
test("fetch fails with an error", () => {
  expect.assertions(1);
  return fetchData().catch((error) => expect(error).toMatch("error"));
});
```



## 6) Zaman aşımları ve jest timeout

Varsayılan Jest zaman aşımı 5 saniyedir. Uzun süren async işlemler için `jest.setTimeout(ms)` ile artırabilirsiniz:

```js
jest.setTimeout(20000); // 20s
```

Ancak testleri gereksiz yere uzatmaktan kaçının; genelde network bağımlılıklarını mocklamak daha iyidir.



## 7) İyi uygulamalar ve ipuçları

- Gerçek ağ çağrılarını testi yavaşlatmamak ve kararsız testi önlemek için HTTP isteklerini mock'layın (ör. `jest.mock('axios')`).
- `async/await` çoğu zaman daha okunur ve hataya dayanıklıdır.
- `done` yalnızca callback API'leri için kullanın; Promise döndüren fonksiyonlarda `done` kullanmayın.
- Asenkron assertion'larınızı `await expect(...).resolves/rejects` ile yazmak kodu daha belirgin kılar.
- Testlerde `setTimeout`/`setInterval` gibi zamanlayıcıları kullanıyorsanız `jest.useFakeTimers()` ile zamanları kontrol edilebilir hâle getirin.



Bu rehberi isterseniz örnek mock senaryoları, `axios` mocking örnekleri veya CI için flaky test azaltma stratejileri ile genişletebilirim.

<!-- navigation top -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="2_Using_Matchers.md">← Önceki</a>
  <span><a href="1_Getting_Started.md">İçindekiler</a></span>
  <a href="4_Setup and Teardown.md">Sonraki →</a>
</div>