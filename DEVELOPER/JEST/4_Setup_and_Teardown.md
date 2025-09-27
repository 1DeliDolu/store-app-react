<!-- navigation top -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="3_Testing Asynchronous Code.md">← Önceki</a>
  <span><a href="1_Getting_Started.md">İçindekiler</a></span>
  <a href="5_Mock_Functions.md">Sonraki →</a>
</div>

# Jest — Setup ve Teardown (before/after Hook'ları)

Test yazarken bazı hazırlık (setup) işleri testlerden önce, bazı temizlik (teardown) işleri ise testlerden sonra çalıştırılmalıdır. Jest bu ihtiyaçlar için kullanımı kolay helper fonksiyonlar sağlar.

## Hook'lar: beforeEach / afterEach

Birden fazla test için tekrar eden hazırlık işleri varsa `beforeEach` ve `afterEach` kullanın.

```js
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});
```

Asenkron işlemler için `beforeEach` / `afterEach` aynı testlerde olduğu gibi Promise döndürebilir veya `done` callback kullanabilir:

```js
beforeEach(() => {
  return initializeCityDatabase(); // Promise döndüren setup
});
```

## Tek seferlik setup/teardown: beforeAll / afterAll

Eğer setup yalnızca bir kez yapılabiliyorsa (ör. başlangıçta ağır bir hazırlık) `beforeAll` ve `afterAll` kullanın:

```js
beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});
```

`beforeAll`/`afterAll` asenkron kodları da destekler.

## Kapsam (Scoping)

Hook'lar en üst seviyede tanımlanırsa dosyadaki tüm testlere uygulanır. `describe` blokları içine konursa sadece o `describe` içindeki testlere uygulanır.

```js
// Top-level: tüm testlere uygulanır
beforeEach(() => initializeCityDatabase());

describe('matching cities to foods', () => {
  // Sadece bu describe içindeki testlere uygulanır
  beforeEach(() => initializeFoodDatabase());

  test('Vienna <3 veal', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });
});
```

> Not: Top-level `beforeEach` önce çalışır, sonra `describe` içindeki `beforeEach` çalışır.

## Çalışma sırası örneği

Aşağıdaki örnek hook'ların yürütülme sırasını gösterir:

```js
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));

test('', () => console.log('1 - test'));

describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));

  test('', () => console.log('2 - test'));
});
```

Çıktı (sıralı):

```
1 - beforeAll
1 - beforeEach
1 - test
1 - afterEach
2 - beforeAll
1 - beforeEach
2 - beforeEach
2 - test
2 - afterEach
1 - afterEach
2 - afterAll
1 - afterAll
```

## Describe ve testlerin toplanma (collection) aşaması

Jest, tüm `describe` bloklarını testleri çalıştırmadan önce işler (collection). Bu yüzden setup/teardown kodlarını `before*` / `after*` içinde tutmak daha güvenlidir. Testler, collection tamamlandıktan sonra sıralı şekilde çalıştırılır.

Örnek yürütme sırası (describe log'ları önce gösterilir, sonra testler çalışır):

```js
// describe blokları çalıştırıldıktan sonra testler yürütülür
// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test 1
// test 2
// test 3
```

## Hook'ların çağrılma sırası ve bağımlılıklar

Hook'lar tanımlama sırasına göre çağrılır; enclosing (sarmalayan) scope'un `after*` hook'ları önce çağrılır. Bu, birbirine bağımlı kaynakları mantıklı bir sırayla kapatmanıza izin verir.

```js
beforeEach(() => console.log('connection setup'));
beforeEach(() => console.log('database setup'));

afterEach(() => console.log('database teardown'));
afterEach(() => console.log('connection teardown'));

test('test 1', () => console.log('test 1'));

describe('extra', () => {
  beforeEach(() => console.log('extra database setup'));
  afterEach(() => console.log('extra database teardown'));

  test('test 2', () => console.log('test 2'));
});
```

## Tekil test çalıştırma ve izolasyon

Hatalı bir testin nedenini izole etmek için tek bir testi çalıştırın:

```js
test.only('this will be the only test that runs', () => {
  expect(true).toBe(false);
});
```

Bir test suite'in tamamında çalışırken başarısız olup tek başına çalıştığında geçen testler, genellikle paylaşılan global durumun (state) etkisindedir. Bu gibi durumlarda `beforeEach` ile paylaşılan durumu temizleyin.

## İyi uygulamalar

- Testler birbirinin yan etkilerini etkilemeyecek şekilde izole edilmelidir. Global state kullanıyorsanız `beforeEach` ile sıfırlayın.
- Ağ çağrılarını veya ağır IO işlemlerini mock'layın (örn. `jest.mock('axios')`) — gerçek çağrılar flaky testlere sebep olur.
- `beforeAll`/`afterAll` sadece gerçekten yeniden kullanılabilir ve maliyeti yüksek setup'lar için kullanın; test izolasyonunu korumak daha önemlidir.
- Hook'larda asenkron kod kullanırken kesinlikle `return`, `await` veya `done` kullanın; aksi halde Jest testin tamamlandığını yanlış anlayabilir.

## Sorun giderme

- Test yalnız çalışırken geçiyor, tüm suite ile çalışırken başarısız oluyorsa paylaşılan state veya sırayla çalışan testler arası bağımlılık kontrol edin.
- Hook'ların beklenmedik sırada çalıştığını düşünüyorsanız `console.log` ile hook yürütme sırasını görselleştirin.



Bu rehberi dilerseniz örnek bir `setupFiles`/`setupFilesAfterEnv` konfigürasyonu ve CI (GitHub Actions) entegrasyonu ile genişletebilirim.

<!-- navigation bottom -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="3_Testing Asynchronous Code.md">← Önceki</a>
  <span></span>
  <a href="5_Mock Functions.md">Sonraki →</a>
</div>