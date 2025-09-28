# Yükseltme

## En Son Sürüm

Next.js’i en son sürüme güncellemek için upgrade codemod aracını kullanabilirsiniz:

```bash
npx @next/codemod@latest upgrade latest
```

Manuel olarak yükseltmeyi tercih ederseniz, en son Next.js ve React sürümlerini yükleyin:

**pnpm**
**npm**
**yarn**
**bun**

```bash
pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## Canary Sürümü

En son Canary sürümüne yükseltmek için önce Next.js’in en son sürümünde olduğunuzdan ve her şeyin beklendiği gibi çalıştığından emin olun. Ardından şu komutu çalıştırın:

```bash
npm i next@canary
```

### Canary’de Kullanılabilen Özellikler

Aşağıdaki özellikler şu anda Canary sürümünde mevcuttur:

**Önbellekleme:**

* `"use cache"`
* `cacheLife`
* `cacheTag`
* `cacheComponents`

**Kimlik Doğrulama:**

* `forbidden`
* `unauthorized`
* `forbidden.js`
* `unauthorized.js`
* `authInterrupts`

## Sürüm Rehberleri

Ayrıntılı yükseltme yönergeleri için sürüm rehberlerine bakın.

* **Sürüm 15**: Next.js uygulamanızı 14’ten 15’e yükseltin.
* **Sürüm 14**: Next.js uygulamanızı 13’ten 14’e yükseltin.
