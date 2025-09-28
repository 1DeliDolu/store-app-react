<!-- navigation top -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="1_Getting_Started.md">← Önceki</a>
  <span><a href="1_Getting_Started.md">İçindekiler</a></span>
  <a href="3_Testing Asynchronous Code.md">Sonraki →</a>
</div>

# Jest Matchers — Hızlı Başvuru

Bu doküman, Jest'te sık kullanılan eşleştiricileri (matchers) kısa ve örneklerle açıklar. Tam liste için resmi `expect` API dokümantasyonuna bakın.

## Temel fikir

`expect(value)` bir beklenti (expectation) objesi döndürür ve üzerine matcher çağrıları yaparsınız. Örnek:

```js
expect(2 + 2).toBe(4);
```

`toBe` kesin eşitlik (Object.is) kullanır. Nesne içeriklerini karşılaştırmak için `toEqual` veya daha katı karşılaştırma için `toStrictEqual` kullanın.

## Eşleştiriciler

### toBe vs toEqual vs toStrictEqual

- `toBe(value)`: `Object.is` ile kesin eşitlik. Primitif değerler için uygundur.
- `toEqual(value)`: Objelerin/array'lerin alanlarını derinlemesine karşılaştırır.
- `toStrictEqual(value)`: `toEqual`'ın daha katı hali — örneğin undefined alanlar veya array sparse durumlarını da dikkate alır.

Örnek:

```js
test("object assignment", () => {
  const data = { one: 1 };
  data.two = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});
```

### not — tersi

Matcher'ların tersini almak için `not` kullanın:

```js
expect(1 + 1).not.toBe(3);
```

## Doğruluk (Truthiness)

Jest, `null`, `undefined`, `true/false` gibi durumları açıkça test etmenizi sağlar:

- `toBeNull()` yalnızca `null` ile eşleşir
- `toBeUndefined()` yalnızca `undefined` ile eşleşir
- `toBeDefined()` `toBeUndefined`'in tersi
- `toBeTruthy()` if deyiminde true olarak değerlendirilen her şeye uyar
- `toBeFalsy()` if deyiminde false olarak değerlendirilen her şeye uyar

Örnek:

```js
test("null and zero", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();

  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

Kullanacağınız matcher, testinizin anlamsal niyetini en iyi şekilde yansıtmalıdır.

## Sayılar

Sayısal karşılaştırmalar için kullanışlı matcher'lar:

- `toBeGreaterThan`, `toBeGreaterThanOrEqual`
- `toBeLessThan`, `toBeLessThanOrEqual`
- `toBeCloseTo` (kayan nokta karşılaştırmaları için)

```js
test("numbers", () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);
  expect(value).toBe(4);
  expect(value).toEqual(4);
});

test("floating point", () => {
  const value = 0.1 + 0.2;
  // expect(value).toBe(0.3) // hassasiyet hatası olur
  expect(value).toBeCloseTo(0.3);
});
```

## String'ler

Düzenli ifadelerle eşleştirme için `toMatch` kullanın:

```js
expect("team").not.toMatch(/I/);
expect("Christoph").toMatch(/stop/);
```

## Diziler ve Iterable'lar

Bir dizinin belirli bir öğeyi içerip içermediğini `toContain` ile kontrol edebilirsiniz:

```js
const shoppingList = [
  "diapers",
  "kleenex",
  "trash bags",
  "paper towels",
  "milk",
];
expect(shoppingList).toContain("milk");
expect(new Set(shoppingList)).toContain("milk");
```

## Hataları test etme (Exceptions)

Bir fonksiyonun çağrıldığında hata fırlatıp fırlatmadığını kontrol etmek için `toThrow` kullanın.

```js
function compileAndroidCode() {
  throw new Error("you are using the wrong JDK!");
}

test("compiling android goes as expected", () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);
  expect(() => compileAndroidCode()).toThrow("you are using the wrong JDK");
  expect(() => compileAndroidCode()).toThrow(/JDK/);
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/);
});
```

İpucu: `toThrow` kullanırken hatayı üreten fonksiyonu, `expect` içine sarmalayan bir fonksiyon olarak verin — doğrudan çağırmayın.

## Asenkron testlerde matchers

Async/Promise döndüren kod için `.resolves` ve `.rejects` yardımcıları ile birlikte matchers kullanın:

```js
await expect(Promise.resolve("ok")).resolves.toBe("ok");
await expect(Promise.reject(new Error("fail"))).rejects.toThrow("fail");
```

Ayrıca `async/await` ile klasik `expect` kombinasyonlarını da kullanabilirsiniz.

## Daha fazlası

Bu dosya sık kullanılan matchers'a hızlı bir bakış sağlar. Aşağıdaki adımlar önerilir:

- Resmi `expect` API dokümantasyonunu inceleyin (tam liste ve daha özel matchers için).
- Asenkron testler, jest mock'ları ve zaman işleme (`jest.useFakeTimers`) hakkında örnekler ekleyin.

İsterseniz bu dosyaya örnek asenkron testler, mock örnekleri ya da `test.each` ile tablo tabanlı test örnekleri ekleyebilirim.

<!-- navigation bottom -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="1_Getting_Started.md">← Önceki</a>
  <span></span>
  <a href="3_Testing Asynchronous Code.md">Sonraki →</a>
</div>
