<!-- navigation top -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <span>← Önceki</span>
  <span><a href="1_Getting_Started.md">İçindekiler</a></span>
  <a href="2_Using_Matchers.md">Sonraki →</a>
</div>

# Jest — Hızlı Başlangıç (Modern Rehber)

> Bu doküman, bir projede Jest ile hızlıca test yazmaya başlamanız için kısa ve uygulanabilir adımları içerir. Hem JavaScript hem TypeScript için notlar bulunur.

## 1) Kurulum

Aşağıdaki komutlardan birini kullanarak Jest'i proje bağımlılığı olarak ekleyin:

```bash
# npm
npm install --save-dev jest

# yarn
yarn add --dev jest

# pnpm
pnpm add -D jest
```

> package.json içine bir `test` script'i eklemek işleri kolaylaştırır:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

## 2) İlk test — adım adım

1. `sum.js` oluşturun:

```js
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

2. `sum.test.js` oluşturun:

```js
const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```

3. Testi çalıştırın:

```bash
npm test
# veya
yarn test
```

Beklenen çıktı benzer şekilde `PASS  ./sum.test.js` ve başarılı bir test sonucu olacaktır.

## 3) CLI kullanımı ve filtreleme

- Belirli bir testi çalıştırmak için dosya veya regex kullanabilirsiniz:

```bash
jest sum.test.js
jest -t "adds 1 + 2"
```

- Testleri paralel veya tek tek çalıştırma, bildirim gösterme, özel konfig kullanma gibi seçenekler için Jest CLI dokümanına bakın.

## 4) Jest yapılandırması (opsiyonel)

Proje bazlı temel konfigürasyon oluşturmak için interaktif kurulum:

```bash
npm init jest@latest
```

Bu komut, proje tipine göre size önerilen bir `jest.config.js` üretir.

## 5) Babel ile birlikte Jest

Babel kullanıyorsanız aşağıdaki paketler gereklidir:

```bash
npm install --save-dev babel-jest @babel/core @babel/preset-env
```

Örnek `babel.config.js`:

```js
module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
```

> Not: Babel ile TypeScript'i sadece transpile ediyorsanız Jest, TypeScript tür denetimi yapmaz. Eğer test sırasında tip denetimi isterseniz `ts-jest` veya ayrı `tsc` çalıştırın.

## 6) Vite / Diğer bundler'lar

- Jest doğrudan Vite ile uyumlu değildir; Vite projeleri için genellikle `vitest` daha iyi bir alternatiftir.
- Webpack veya Parcel kullanan projelerde çoğu zaman ekstra ayar gerekmez; ancak özel loader/plugin'ler varsa ince ayar yapmanız gerekebilir.

## 7) TypeScript ile Jest

İki yaygın yaklaşım:

1. Babel ile transpile edip Jest ile çalıştırmak (hızlı ancak tip kontrolü yapmaz).
2. `ts-jest` kullanmak (Jest içinde TypeScript desteği — tipleri korur ve source map sunar).

`ts-jest` örneği:

```bash
npm install --save-dev ts-jest
npx ts-jest config:init
```

## 8) Tip tanımları (TypeScript projeleri)

İki seçenek:

- `@jest/globals` kullanarak Jest API'larını import etmek:

```bash
npm install --save-dev @jest/globals
```

ve test dosyası örneği (`sum.test.ts`):

```ts
import { describe, expect, test } from "@jest/globals";
import { sum } from "./sum";

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

- Alternatif: `@types/jest` paketini kurarak Jest global tiplerini sağlayabilirsiniz.

## 9) ESLint entegrasyonu

- Jest global helper'larını ESLint'e bildirmek için `.eslintrc` içinde `env: { jest: true }` ayarı veya `eslint-plugin-jest` kullanılabilir.
- Eğer `@jest/globals` import ederseniz ESLint `no-undef` uyarıları ortadan kalkar.

## 10) İleri ipuçları

- `describe.each` / `test.each` ile tablo tabanlı (parametreli) test yazın.
- Bağımlılıkları izole etmek için `jest.fn()` ile mock kullanın.
- Büyük test setlerinde `--runInBand` veya test filtreleme seçenekleriyle hız kontrolü yapın.
- Vite kullanan projeler için `vitest`'i değerlendirin (Jest'e benzer API, Vite uyumlu).

İsterseniz bu rehbere örnek test dosyaları (`__tests__/`), bir `vitest` alternatifi bölümü veya CI entegrasyon adımlarını ekleyebilirim.

<!-- navigation top -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <span>← Önceki</span>
  <span><a href="1_Getting_Started.md">İçindekiler</a></span>
  <a href="2_Using_Matchers.md">Sonraki →</a>
</div>