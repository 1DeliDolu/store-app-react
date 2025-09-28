````markdown
Sunucu ve İstemci Bileşenleri

Varsayılan olarak, layout ve sayfalar **Server Components**’tır. Bu, verileri sunucudan getirmenize, arayüzünüzün parçalarını sunucuda işlemenize, isteğe bağlı olarak sonucu önbelleğe almanıza ve istemciye aktarmanıza olanak tanır. Etkileşim veya tarayıcı API’lerine ihtiyacınız olduğunda, işlevselliği katmanlamak için **Client Components** kullanabilirsiniz.

Bu sayfa, Next.js’te Server ve Client Components’in nasıl çalıştığını, ne zaman kullanılacağını ve uygulamanızda bunları birlikte nasıl oluşturabileceğinizi örneklerle açıklar.

## Ne Zaman Server ve Client Components Kullanılır?

İstemci ve sunucu ortamlarının farklı yetenekleri vardır. Server ve Client bileşenleri, kullanım durumunuza bağlı olarak mantığı her ortamda çalıştırmanıza olanak sağlar.

### Client Components’i şunlara ihtiyaç duyduğunuzda kullanın:

- **State** ve event handler’lar. Örn: `onClick`, `onChange`.
- **Lifecycle** mantığı. Örn: `useEffect`.
- Yalnızca tarayıcıya özgü API’ler. Örn: `localStorage`, `window`, `Navigator.geolocation` vb.
- **Custom hooks**.

### Server Components’i şunlara ihtiyaç duyduğunuzda kullanın:

- Verileri veritabanlarından veya kaynağa yakın API’lerden getirmek.
- API anahtarları, token’lar ve diğer gizli bilgileri istemciye açmadan kullanmak.
- Tarayıcıya gönderilen JavaScript miktarını azaltmak.
- **First Contentful Paint (FCP)**’i iyileştirmek ve içeriği istemciye kademeli olarak aktarmak.

---

Örneğin, `<Page>` bileşeni bir **Server Component** olup bir gönderiyle ilgili verileri getirir ve bunları, istemci tarafı etkileşimlerini yöneten `<LikeButton>` bileşenine props olarak aktarır.

### app/[id]/page.tsx
```typescript
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
 
  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
````

### app/ui/like-button.tsx

```typescript
'use client'
 
import { useState } from 'react'
 
export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

````markdown
Next.js’te Server ve Client Components Nasıl Çalışır?
---------------------------------------------------

### Sunucuda

Sunucuda, Next.js React’in API’lerini kullanarak render işlemini yönetir. Render işi, bireysel rota segmentlerine (layout ve sayfalar) göre parçalara ayrılır:

- **Server Components**, React Server Component Payload (RSC Payload) adı verilen özel bir veri formatına dönüştürülür.  
- **Client Components** ve **RSC Payload**, HTML’in önceden işlenmesi (prerender) için kullanılır.

#### React Server Component Payload (RSC) Nedir?

RSC Payload, render edilmiş React Server Components ağacının sıkıştırılmış ikili (binary) bir temsilidir. İstemcide React tarafından tarayıcının DOM’unu güncellemek için kullanılır. RSC Payload şunları içerir:

- Server Components’in render edilmiş sonucu  
- Client Components’in nerede render edilmesi gerektiğini gösteren yer tutucular ve onların JavaScript dosyalarına referanslar  
- Bir Server Component’ten bir Client Component’e aktarılan tüm props’lar  

---

### İstemcide (ilk yükleme)

İstemci tarafında:

- **HTML**, kullanıcıya hızlı ve etkileşimsiz bir rota önizlemesi göstermek için kullanılır.  
- **RSC Payload**, Client ve Server Component ağaçlarını eşleştirmek için kullanılır.  
- **JavaScript**, Client Components’i hydrate ederek uygulamayı etkileşimli hale getirir.  

#### Hydration Nedir?

Hydration, React’in DOM’a **event handler**’ları bağlayarak statik HTML’i etkileşimli hale getirme sürecidir.  

---

### Sonraki Gezinmeler

Sonraki gezinmelerde:

- RSC Payload önceden alınır (prefetch) ve anında gezinme için önbelleğe alınır.  
- Client Components tamamen istemci tarafında render edilir, sunucu tarafı HTML gerekmez.  

---

## Örnekler

### Client Components Kullanımı

Bir **Client Component** oluşturmak için dosyanın en üstüne, import’lardan önce `"use client"` yönergesini ekleyin.

#### app/ui/counter.tsx
```typescript
'use client'
 
import { useState } from 'react'
 
export default function Counter() {
  const [count, setCount] = useState(0)
 
  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
````

`"use client"` ifadesi, **Server ve Client modül ağaçları (module graph/tree)** arasında bir sınır oluşturur.

Bir dosya `"use client"` ile işaretlendiğinde, o dosyanın **tüm import’ları ve alt bileşenleri istemci paketinin bir parçası** sayılır. Bu nedenle, istemciye özel her bileşene ayrıca bu yönergeyi eklemeniz gerekmez.

---

### JS Paket Boyutunu Küçültme

İstemci JavaScript paket boyutunu küçültmek için, `"use client"` yalnızca etkileşimli bileşenlere eklenmeli, geniş UI alanları Client Component olarak işaretlenmemelidir.

Örneğin, `<Layout>` bileşeni büyük ölçüde statik öğeler (logo, navigasyon linkleri) içerir, ancak etkileşimli bir arama çubuğu barındırır. Bu durumda yalnızca `<Search />` Client Component olmalı, geri kalan layout Server Component olarak kalabilir.

#### app/layout.tsx

```typescript
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'
 
// Layout varsayılan olarak bir Server Component’tir
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

#### app/ui/search.tsx

```typescript
'use client'
 
export default function Search() {
  // ...
}
```

---

### Server’dan Client Components’e Veri Aktarma

Server Components’ten Client Components’e veri, **props** üzerinden aktarılabilir.

#### app/[id]/page.tsx

```typescript
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
 
  return <LikeButton likes={post.likes} />
}
```

#### app/ui/like-button.tsx

```typescript
'use client'
 
export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

Alternatif olarak, bir Server Component’ten bir Client Component’e veri **use Hook** ile akış (streaming) şeklinde gönderilebilir. (Örneğe bakınız.)

💡 **Bilmekte Fayda Var:** Client Components’e aktarılan props’ların **React tarafından serileştirilebilir (serializable)** olması gerekir.


````markdown
Server ve Client Components’i İç İçe Kullanma
---------------------------------------------

Server Components’i, bir Client Component’e **prop olarak** geçebilirsiniz. Bu, istemci tarafı bileşenlerin içinde sunucuda işlenmiş (server-rendered) UI’ı görsel olarak iç içe yerleştirmenizi sağlar.

Yaygın bir kullanım deseni, `<ClientComponent>` içinde bir **slot** oluşturmak için `children` kullanmaktır. Örneğin, görünürlüğü kontrol etmek için istemci tarafı state kullanan bir `<Modal>` bileşeni içinde, sunucuda veri getiren bir `<Cart>` bileşeni olabilir.

### app/ui/modal.tsx
```typescript
'use client'
 
export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
````

Daha sonra, üst düzey bir **Server Component** (ör. `<Page>`) içinde `<Cart>` bileşenini `<Modal>`’in child’ı olarak geçebilirsiniz:

### app/page.tsx

```typescript
import Modal from './ui/modal'
import Cart from './ui/cart'
 
export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

Bu desende, prop olarak geçirilenler dahil olmak üzere tüm **Server Components** önceden sunucuda işlenir. Ortaya çıkan **RSC payload**, bileşen ağacında Client Components’in nerede işleneceğine dair referanslar içerir.

---

## Context Providers

React context genellikle geçerli tema gibi **global state**’i paylaşmak için kullanılır. Ancak, React context **Server Components içinde desteklenmez**.

Context kullanmak için, children kabul eden bir Client Component oluşturun:

### app/theme-provider.tsx

```typescript
'use client'
 
import { createContext } from 'react'
 
export const ThemeContext = createContext({})
 
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

Daha sonra bunu bir **Server Component** içinde (örn. layout) kullanabilirsiniz:

### app/layout.tsx

```typescript
import ThemeProvider from './theme-provider'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

Artık Server Component doğrudan provider’ınızı render edebilir ve uygulamanızdaki diğer tüm Client Components bu context’i tüketebilir.

💡 **Bilmekte Fayda Var:** Provider’ları ağaçta mümkün olduğunca **derine** yerleştirin. Örneğin, `ThemeProvider` yalnızca `{children}`’i sarmalıyor, tüm `<html>` belgesini değil. Bu, Next.js’in Server Components’in statik kısımlarını daha iyi optimize etmesini kolaylaştırır.

---

## Üçüncü Parti Bileşenler

Yalnızca istemciye özgü özelliklere bağlı olan üçüncü parti bileşenleri kullandığınızda, onların doğru çalışması için bunları bir **Client Component** içine sarmanız gerekir.

Örneğin, `<Carousel />` bileşeni `acme-carousel` paketinden alınabilir. Bu bileşen `useState` kullanır, fakat `"use client"` yönergesi ekli değildir.

Bunu bir Client Component içinde kullanırsanız doğru çalışır:

### app/gallery.tsx

```typescript
'use client'
 
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
 
export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)
 
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* Çalışır, çünkü Carousel bir Client Component içinde kullanılıyor */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

Ancak, doğrudan bir **Server Component** içinde kullanmayı denerseniz hata alırsınız. Bunun nedeni, Next.js’in `<Carousel />`’in yalnızca istemci özelliklerini kullandığını bilmemesidir.

Bunu düzeltmek için, istemciye özgü özelliklere bağlı üçüncü parti bileşenleri kendi **Client Component**’inizle sarmanız gerekir:

### app/carousel.tsx

```typescript
'use client'
 
import { Carousel } from 'acme-carousel'
 
export default Carousel
```

Artık `<Carousel />` bileşenini doğrudan bir Server Component içinde kullanabilirsiniz:

### app/page.tsx

```typescript
import Carousel from './carousel'
 
export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/* Çalışır, çünkü Carousel bir Client Component’tir */}
      <Carousel />
    </div>
  )
}
```

### 📌 Kütüphane Yazarlarına Tavsiye

Bir bileşen kütüphanesi geliştiriyorsanız, istemciye özgü özelliklere dayanan giriş noktalarına `"use client"` yönergesini ekleyin. Böylece kullanıcılarınız, Server Components içinde wrapper oluşturmadan bileşenleri import edebilir.

Not: Bazı bundler’lar `"use client"` yönergelerini silebilir. `esbuild` için nasıl yapılandırılacağını görmek için **React Wrap Balancer** ve **Vercel Analytics** depolarına bakabilirsiniz.

---

## Ortam Zehirlenmesini (Environment Poisoning) Önleme

JavaScript modülleri hem Server hem de Client Components arasında paylaşılabilir. Bu, istemciye yanlışlıkla yalnızca sunucuya özel kod import etmenize yol açabilir.

Örneğin şu fonksiyonu düşünün:

### lib/data.ts

```typescript
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```

Bu fonksiyon, istemciye **asla açılmaması gereken** bir `API_KEY` içeriyor.

Next.js’te yalnızca `NEXT_PUBLIC_` ile başlayan ortam değişkenleri istemci paketine dahil edilir. Eğer değişkenler bu öneke sahip değilse, Next.js bunları boş string ile değiştirir.

Sonuç olarak, `getData()` istemcide import edilip çalıştırılsa bile beklenildiği gibi çalışmaz.

Yanlış kullanımın önüne geçmek için `server-only` paketini kullanabilirsiniz.

### lib/data.js

```typescript
import 'server-only'
 
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```

Artık bu modülü bir Client Component içinde import etmeyi denerseniz, **build-time hatası** alırsınız.

Buna karşılık, yalnızca istemci mantığı içeren (örn. `window` objesine erişim yapan) modülleri işaretlemek için `client-only` paketini kullanabilirsiniz.

📦 Terminal:

```bash
pnpm add server-only
```

Next.js, `server-only` ve `client-only` import’larını dahili olarak işler ve bir modül yanlış ortamda kullanıldığında daha anlaşılır hata mesajları verir. Bu paketlerin NPM’deki içeriği Next.js tarafından **kullanılmaz**.

Ayrıca, Next.js kendi `server-only` ve `client-only` tip deklarasyonlarını sağlar; bu, TypeScript’te `noUncheckedSideEffectImports` ayarı aktifken faydalıdır.

---

## Sonraki Adımlar

Bu sayfada bahsedilen API’ler hakkında daha fazla bilgi edinin:

* **use client**
  Bir bileşeni istemcide render etmek için `use client` yönergesini nasıl kullanacağınızı öğrenin.


