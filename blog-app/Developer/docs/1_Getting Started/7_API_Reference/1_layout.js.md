# layout.js

`layout` dosyası, Next.js uygulamanızda bir düzen tanımlamak için kullanılır.

---

## app/dashboard/layout.tsx

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

---

## Kök Layout

Bir kök layout, `app` dizinindeki en üst düzey layout’tur. `<html>` ve `<body>` etiketlerini ve diğer global paylaşılan UI öğelerini tanımlamak için kullanılır.

### app/layout.tsx

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

---

## Referans

### Props

* **children (zorunlu)**
  Layout bileşenleri bir `children` prop’u kabul etmeli ve kullanmalıdır. Render sırasında `children`, layout’un sardığı route segmentleriyle doldurulur. Bunlar genellikle bir alt Layout (varsa) veya Page bileşeni olur, fakat gerektiğinde Loading veya Error gibi özel dosyalar da olabilir.

* **params (opsiyonel)**
  Kök segmentten o layout’a kadar olan dinamik route parametrelerini içeren bir nesneye çözümlenen bir Promise.

#### Örnek

```tsx
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const { team } = await params
}
```

| Example Route                   | URL          | params                           |
| ------------------------------- | ------------ | -------------------------------- |
| app/dashboard/[team]/layout.js  | /dashboard/1 | Promise<{ team: '1' }>           |
| app/shop/[tag]/[item]/layout.js | /shop/1/2    | Promise<{ tag: '1', item: '2' }> |
| app/blog/[...slug]/layout.js    | /blog/1/2    | Promise<{ slug: ['1', '2'] }>    |

⚠️ `params` bir Promise olduğundan, değerlerine erişmek için `async/await` veya React’in `use` fonksiyonunu kullanmalısınız.

> **Not:** v14 ve öncesinde `params` senkrondu. v15’te hâlâ senkron erişim mümkün, fakat bu gelecekte kaldırılacaktır.

---

## Layout Props Helper

`LayoutProps` ile layout’ları tipleyerek, `params` ve dizin yapınızdan türetilmiş adlandırılmış slot’lar için güçlü tip desteği alabilirsiniz. `LayoutProps` global olarak kullanılabilen bir yardımcıdır.

```tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {/* Eğer app/dashboard/@analytics varsa, tiplenmiş slot olarak görünür: */}
      {/* {props.analytics} */}
    </section>
  )
}
```

👉 Tipler, `next dev`, `next build` veya `next typegen` sırasında üretilir.

---

## Kök Layout

* `app` dizini mutlaka bir kök layout içermelidir (genellikle `app/layout.js`).
* Kök layout **<html>** ve **<body>** etiketlerini tanımlamak zorundadır.
* `<head>` etiketlerini (örn. `<title>`, `<meta>`) elle eklememelisiniz. Bunun yerine **Metadata API** kullanın.
* Route grupları ile birden fazla kök layout oluşturabilirsiniz.
* Birden fazla kök layout arasında gezinmek tam sayfa yüklemesine neden olur (client-side navigation değil).
* Kök layout dinamik segment altında da olabilir (örn. `app/[lang]/layout.js` ile i18n).

---

## Sınırlamalar ve Notlar

### Request Object

* Layout’lar client üzerinde **cache’lenir**, yeniden render edilmez.
* Bu nedenle request nesnesine doğrudan erişemezsiniz.
* Request verilerine erişmek için `headers` ve `cookies` API’lerini kullanabilirsiniz.

```tsx
import { cookies } from 'next/headers'
 
export default async function Layout({ children }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

### Query Params

* Layout’lar yeniden render edilmez → search params **bayatlar**.
* Güncel query param’lara erişmek için:

  * `Page` içindeki `searchParams` prop’unu,
  * veya `useSearchParams` hook’unu Client Component içinde kullanın.

```tsx
'use client'
import { useSearchParams } from 'next/navigation'
 
export default function Search() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  return '...'
}
```

### Pathname

* Layout’lar yeniden render edilmez → pathname **bayatlar**.
* Güncel pathname’e erişmek için Client Component içinde `usePathname` kullanın.

```tsx
'use client'
import { usePathname } from 'next/navigation'
 
export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/')
 
  return (
    <nav>
      {segments.map((segment, index) => (
        <span key={index}>{' > '}{segment}</span>
      ))}
    </nav>
  )
}
```

### Veri Çekme

* Layout’lar çocuklarına veri **aktarmaz**.
* Aynı veriyi birden fazla kez fetch edebilirsiniz. Next.js, fetch isteklerini otomatik olarak **dedupe** eder.

```tsx
export async function getUser(id: string) {
  const res = await fetch(`https://.../users/${id}`)
  return res.json()
}
```

### Alt Segmentlere Erişim

* Layout, kendisinin altındaki route segmentlerine doğrudan erişemez.
* Bunun için Client Component’lerde `useSelectedLayoutSegment` veya `useSelectedLayoutSegments` kullanabilirsiniz.

```tsx
'use client'
import { useSelectedLayoutSegment } from 'next/navigation'
 
export default function NavLink({ slug, children }: { slug: string, children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment
  return (
    <a href={`/blog/${slug}`} style={{ fontWeight: isActive ? 'bold' : 'normal' }}>
      {children}
    </a>
  )
}
```

---

## Örnekler

### Metadata

```tsx
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Next.js',
}
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return '...'
}
```

### Aktif Nav Linkleri

```tsx
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
 
export function NavLinks() {
  const pathname = usePathname()
 
  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">Home</Link>
      <Link className={`link ${pathname === '/about' ? 'active' : ''}`} href="/about">About</Link>
    </nav>
  )
}
```

### Params ile İçerik Gösterme

```tsx
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const { team } = await params
  return (
    <section>
      <header><h1>Welcome to {team}'s Dashboard</h1></header>
      <main>{children}</main>
    </section>
  )
}
```

### Client Component’te Params Kullanma

```tsx
'use client'
import { use } from 'react'
 
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
}
```

---

## Sürüm Geçmişi

| Version    | Changes                                     |
| ---------- | ------------------------------------------- |
| v15.0.0-RC | `params` artık bir Promise. Codemod mevcut. |
| v13.0.0    | `layout` tanıtıldı.                         |
