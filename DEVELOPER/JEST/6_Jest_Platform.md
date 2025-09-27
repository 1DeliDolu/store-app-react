<!-- navigation top -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="5_Mock Functions.md">← Önceki</a>
  <span><a href="1_Getting_Started.md">İçindekiler</a></span>
  <span>Sonraki →</span>
</div>

# Jest Platform — Tekil Paketler ve Kısa Kullanım Rehberi

Jest, çekirdek test runner dışında bağımsız olarak kullanılabilecek birkaç yardımcı paket sağlar. Bu dosya, bu paketlerin kısa açıklamalarını ve küçük kullanım örneklerini toplar.

## Hızlı liste

- `jest-changed-files` — Git/Hg deposundaki değişen dosyaları tespit etme aracı.
- `jest-diff` — İki değerin farkını "pretty" biçimde gösteren diff fonksiyonu.
- `jest-docblock` — Dosyanın üstündeki docblock yorumlarını parse etme ve pragma okumak için araç.
- `@jest/get-type` — Bir JS değerinin primitif türünü döndürür.
- `jest-validate` — Kullanıcı yapılandırmalarını doğrulayan yardımcı.
- `jest-worker` — Ağır görevleri fork'lar üzerinde paralel çalıştırmak için worker havuzu.
- `pretty-format` — Her türlü JS değerini insan tarafından okunabilir string'e çevirir.

Aşağıda her bir pakete kısa örnekler ve notlar bulunmaktadır.

## jest-changed-files

Ne işe yarar: Git veya Hg deposunda hangi dosyaların değiştiğini bulur. CI optimizasyonu veya yalnızca değişen testleri çalıştırmak için kullanışlıdır.

Örnek:

```js
const { getChangedFilesForRoots } = require("jest-changed-files");

getChangedFilesForRoots(["./"], { lastCommit: true }).then((result) => {
  console.log(result.changedFiles);
});
```

Çıktı: değişen dosya yollarının kümesi.

## jest-diff

Ne işe yarar: İki değer arasındaki farkı insan tarafından okunabilir bir şekilde gösterir — snapshot veya hata mesajı üretiminde faydalıdır.

Örnek:

```js
const { diff } = require("jest-diff");
const a = { a: { b: { c: 5 } } };
const b = { a: { b: { c: 6 } } };
console.log(diff(a, b));
```

## jest-docblock

Ne işe yarar: Bir dosyanın başındaki comment bloğunu ayrıştırır ve pragmaları (ör. `@flow`) okur.

Örnek:

```js
const { parseWithComments } = require("jest-docblock");
const code = `/**\n * @flow\n */\nconsole.log('hi');`;
console.log(parseWithComments(code));
```

## @jest/get-type

Ne işe yarar: Verilen değerin türünü ("array", "null", "object", vb.) döndürür. Test araçları veya formatlayıcılar için kullanışlıdır.

Örnek:

```js
const { getType } = require("@jest/get-type");
console.log(getType([1, 2, 3])); // 'array'
console.log(getType(null)); // 'null'
```

## jest-validate

Ne işe yarar: Kullanıcı konfigürasyonlarını doğrulamak ve deprecation/uyarıları raporlamak için kullanılır.

Örnek:

```js
const { validate } = require("jest-validate");
const result = validate(
  { transform: "<rootDir>/custom" },
  { exampleConfig: { transform: "<rootDir>/node_modules/babel-jest" } }
);
console.log(result);
```

`result` içinde `isValid` ve `hasDeprecationWarnings` gibi alanlar bulunur.

## jest-worker

Ne işe yarar: CPU-yoğun veya paralel çalıştırılabilir görevleri ayrı proseslerde çalıştırmak için hafif bir worker havuzu sağlar. Test araçları ve paralel görevler için uygundur.

Örnek kullanım:

```js
// heavy-task.js
module.exports = {
  myHeavyTask: (args) => {
    // CPU yoğun görev
    return doWork(args);
  },
};

// main.js
const Worker = require("jest-worker").Worker;
async function main() {
  const worker = new Worker(require.resolve("./heavy-task"));
  const results = await Promise.all([
    worker.myHeavyTask({ foo: "bar" }),
    worker.myHeavyTask({ bar: "foo" }),
  ]);
  console.log(results);
}
main();
```

Not: Node.js child process bazlıdır; veri serileştirme/toplama maliyeti olduğunu unutmayın.

## pretty-format

Ne işe yarar: JS değerlerini okunabilir string'lere çevirir. Jest snapshot ve diff çıktılarında kullanılır; döngüsel referanslar, Map/Set, Symbol gibi tipleri destekler.

Örnek:

```js
const { format: prettyFormat } = require("pretty-format");
const val = { a: 1, b: new Map([["x", "y"]]) };
console.log(prettyFormat(val));
```

Ayrıca plugin desteği ile özel tipler için biçimlendirme genişletilebilir.

## Nerede kullanılır / Notlar

- Bu paketler, Jest'in tek bir bağımlılık olarak kullanılmasını sağlar; test runner'ın içindeki yardımcı işlevleri kendi araçlarınızda kullanabilirsiniz.
- Vite veya özel test araçları geliştirirken, bu paketlerden uygun olanları alıp bağımsızca kullanmak faydalıdır.
- Her paketin README'inde detaylı kullanım, API ve sürüm uyumluluk notları bulunur — üretime almadan önce README'leri kontrol edin.

İsterseniz bu dosyaya küçük bir örnek proje ekleyebilirim (ör. `jest-worker` kullanan mini paralel işlemci) veya her paket için `npm install` komut snippet'leri ekleyebilirim. Hangi genişletmeyi istersiniz?

<!-- navigation bottom -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="5_Mock Functions.md">← Önceki</a>
  <span></span>
  <span>Sonraki →</span>
</div>
