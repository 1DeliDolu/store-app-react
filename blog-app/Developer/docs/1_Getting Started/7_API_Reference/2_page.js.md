````markdown
page.js  
Sayfa dosyası, bir rotaya özgü kullanıcı arayüzünü tanımlamanıza olanak tanır. Bir dosyadan varsayılan olarak bir bileşen dışa aktararak sayfa oluşturabilirsiniz:

app/blog/[slug]/page.tsx  
TypeScript

```typescript
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return <h1>My Page</h1>
}
````

### Bilmekte Fayda Var

* Sayfalar için `.js`, `.jsx` veya `.tsx` dosya uzantıları kullanılabilir.
* Bir sayfa her zaman rota alt ağacının yaprağıdır.
* Bir rota segmentinin herkese açık olabilmesi için bir sayfa dosyası gereklidir.
* Sayfalar varsayılan olarak **Server Component**’tir, ancak bir **Client Component** olarak ayarlanabilir.

---

## Referans

### Props

#### params (opsiyonel)

Kök segmentten o sayfaya kadar olan dinamik rota parametrelerini içeren bir nesneye çözümlenen bir **promise**.

app/shop/[slug]/page.tsx
TypeScript

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}
```

**Örnek**

| Rota Dosyası                       | URL       | params                                 |
| ---------------------------------- | --------- | -------------------------------------- |
| app/shop/[slug]/page.js            | /shop/1   | Promise<{ slug: '1' }>                 |
| app/shop/[category]/[item]/page.js | /shop/1/2 | Promise<{ category: '1', item: '2' } > |
| app/shop/[...slug]/page.js         | /shop/1/2 | Promise<{ slug: ['1', '2'] }>          |

* `params` bir promise olduğu için değerlerine erişmek için **async/await** veya React’in `use` fonksiyonunu kullanmalısınız.
* v14 ve önceki sürümlerde `params` senkron bir prop’tu. v15’te hala senkron olarak erişilebilir (geri uyumluluk için), ancak bu davranış gelecekte kaldırılacaktır.

---

#### searchParams (opsiyonel)

Geçerli URL’nin arama parametrelerini içeren bir nesneye çözümlenen bir **promise**.

app/shop/page.tsx
TypeScript

```typescript
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

**Client Component sayfaları** da React’in `use` fonksiyonunu kullanarak `searchParams`'e erişebilir:

```typescript
'use client'
import { use } from 'react'
 
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = use(searchParams).filters
}
```

**Örnek**

| URL           | searchParams                |
| ------------- | --------------------------- |
| /shop?a=1     | Promise<{ a: '1' }>         |
| /shop?a=1&b=2 | Promise<{ a: '1', b: '2' }> |
| /shop?a=1&a=2 | Promise<{ a: ['1', '2'] }>  |

* `searchParams` bir promise olduğu için **async/await** veya React’in `use` fonksiyonunu kullanmalısınız.
* v14 ve önceki sürümlerde `searchParams` senkron bir prop’tu. v15’te hala senkron olarak erişilebilir (geri uyumluluk için), ancak bu davranış gelecekte kaldırılacaktır.
* `searchParams`, değerleri önceden bilinmeyen **Dinamik API**’dir. Kullanıldığında, sayfayı istek zamanında dinamik işleme moduna geçirir.
* `searchParams` düz bir JavaScript nesnesidir, **URLSearchParams** örneği değildir.

---

### Page Props Helper

Sayfaları `PageProps` ile tipleyerek, route literal üzerinden **params** ve **searchParams** için güçlü tip desteği alabilirsiniz.
`PageProps` global olarak kullanılabilir.

app/blog/[slug]/page.tsx
TypeScript

```typescript
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
  return <h1>Blog Post: {slug}</h1>
}
```

**Bilmekte Fayda Var**

* Route literal kullanımı (örn. `'/blog/[slug]'`) otomatik tamamlama ve parametreler için katı anahtar desteği sağlar.
* Statik rotalar için `params` `{}` olur.
* Tipler `next dev`, `next build` veya `next typegen` sırasında üretilir.

---

## Örnekler

### Params kullanarak içerik gösterme

Dinamik rota segmentleri sayesinde, `params` prop’una göre belirli içerikler gösterebilir veya çekebilirsiniz.

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>Blog Post: {slug}</h1>
}
```

---

### searchParams ile filtreleme işleme

`searchParams` prop’u, URL’nin query string’ine göre filtreleme, sayfalama veya sıralama yapmak için kullanılabilir.

```typescript
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { page = '1', sort = 'asc', query = '' } = await searchParams
 
  return (
    <div>
      <h1>Product Listing</h1>
      <p>Search query: {query}</p>
      <p>Current page: {page}</p>
      <p>Sort order: {sort}</p>
    </div>
  )
}
```

---

### Client Component’lerde searchParams ve params okuma

Client Component async olamayacağı için, `use` fonksiyonunu kullanarak promise değerleri okuyabilirsiniz.

```typescript
'use client'
 
import { use } from 'react'
 
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = use(params)
  const { query } = use(searchParams)
}
```

---

## Sürüm Geçmişi

| Sürüm      | Değişiklikler                                                 |
| ---------- | ------------------------------------------------------------- |
| v15.0.0-RC | `params` ve `searchParams` artık promise. Bir codemod mevcut. |
| v13.0.0    | `page` özelliği eklendi.                                      |


