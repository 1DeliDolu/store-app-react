# Hata Yönetimi

Hatalar iki kategoriye ayrılabilir: **beklenen hatalar** ve **yakalanmamış istisnalar**. Bu sayfa, Next.js uygulamanızda bu hataları nasıl yönetebileceğinizi açıklar.

---

## Beklenen Hataların Yönetimi

Beklenen hatalar, uygulamanın normal çalışması sırasında ortaya çıkabilecek durumlardır. Örneğin:

* Sunucu tarafı form doğrulama hataları
* Başarısız istekler

Bu hatalar **açıkça ele alınmalı** ve istemciye döndürülmelidir.

### Server Functions

Beklenen hataları yönetmek için `useActionState` kancasını kullanabilirsiniz.

👉 Bu tip hatalar için **try/catch blokları kullanmaktan ve hata fırlatmaktan kaçının**. Bunun yerine, beklenen hataları **dönüş değerleri olarak modelleyin**.

**app/actions.ts**

```ts
'use server'
 
export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
 
  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()
 
  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
}
```

Aksiyonunuzu `useActionState` kancasına aktarabilir ve dönen durumu kullanarak hata mesajı görüntüleyebilirsiniz.

**app/ui/form.tsx**

```tsx
'use client'
 
import { useActionState } from 'react'
import { createPost } from '@/app/actions'
 
const initialState = {
  message: '',
}
 
export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)
 
  return (
    <form action={formAction}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create Post</button>
    </form>
  )
}
```

### Server Components

Bir Server Component içinde veri çekerken, yanıtı kullanarak koşullu olarak hata mesajı gösterebilir veya yönlendirme yapabilirsiniz.

**app/page.tsx**

```tsx
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()
 
  if (!res.ok) {
    return 'There was an error.'
  }
 
  return '...'
}
```

---

## Not Found

Bir rota segmenti içinde `notFound` fonksiyonunu çağırabilir ve `not-found.js` dosyası ile 404 arayüzü gösterebilirsiniz.

**app/blog/[slug]/page.tsx**

```tsx
import { getPostBySlug } from '@/lib/posts'
 
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
 
  if (!post) {
    notFound()
  }
 
  return <div>{post.title}</div>
}
```

**app/blog/[slug]/not-found.tsx**

```tsx
export default function NotFound() {
  return <div>404 - Page Not Found</div>
}
```

---

## Yakalanmamış İstisnaların Yönetimi

Yakalanmamış istisnalar, uygulamanın normal akışında meydana gelmemesi gereken beklenmedik hatalardır. Bunlar genellikle **bug** veya beklenmedik sorunları gösterir.

👉 Bu tür hatalar **throw ile fırlatılmalı** ve ardından **error boundary** bileşenleri tarafından yakalanmalıdır.

### İç İçe Error Boundaries

Next.js, yakalanmamış istisnaları yönetmek için **error boundaries** kullanır.

* Error boundaries, child bileşenlerdeki hataları yakalar.
* Çöken bileşen ağacının yerine **fallback UI** gösterir.

Bir hata sınırı oluşturmak için rota segmenti içine `error.tsx` dosyası ekleyin ve bir React bileşeni export edin:

**app/dashboard/error.tsx**

```tsx
'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hata raporlama servisine logla
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Segmenti yeniden render ederek toparlanmayı dene
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

Hatalar, en yakın üst **error boundary** bileşenine kadar yukarı taşınır.

👉 Bu sayede farklı rota seviyelerine `error.tsx` dosyaları ekleyerek daha **granüler hata yönetimi** yapılabilir.


![alt text](image.png)

# Error Boundaries ve Global Hata Yönetimi

Error boundaries, **event handler** içindeki hataları yakalamaz.
Bunlar, uygulamanın tamamen çökmesini önlemek için **rendering sırasında oluşan hataları yakalayıp fallback UI** göstermeye yarar.

Genel olarak:

* Event handler’larda veya async kodlarda oluşan hatalar **error boundaries tarafından yakalanmaz**, çünkü render işleminden **sonra** çalışırlar.
* Bu tip durumları yönetmek için hatayı **manuel olarak yakalayın** ve `useState` veya `useReducer` ile saklayın, ardından kullanıcıya bilgi verecek şekilde UI’yi güncelleyin.

---

## Event Handler İçindeki Hataları Yönetmek

**app/ui/button.tsx**

```tsx
'use client'
 
import { useState } from 'react'
 
export function Button() {
  const [error, setError] = useState(null)
 
  const handleClick = () => {
    try {
      // başarısız olabilecek bir işlem
      throw new Error('Exception')
    } catch (reason) {
      setError(reason)
    }
  }
 
  if (error) {
    /* fallback UI render et */
  }
 
  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  )
}
```

---

## useTransition İçindeki Hatalar

💡 `useTransition` içinden `startTransition` ile tetiklenen hatalar, **en yakın error boundary’e kadar yukarı taşınır.**

**app/ui/button.tsx**

```tsx
'use client'
 
import { useTransition } from 'react'
 
export function Button() {
  const [pending, startTransition] = useTransition()
 
  const handleClick = () =>
    startTransition(() => {
      throw new Error('Exception')
    })
 
  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  )
}
```

---

## Global Hatalar

Daha nadir olsa da, hataları kök layout düzeyinde `global-error.js` dosyası ile yönetebilirsiniz.

Bu dosya **root app dizini** içine yerleştirilir ve **uluslararasılaştırma (i18n)** kullanılsa bile geçerlidir.
Global hata arayüzü, aktif olduğunda root layout veya template’in yerine geçtiği için **kendi `<html>` ve `<body>` etiketlerini** tanımlamak zorundadır.

**app/global-error.tsx**

```tsx
'use client' // Error boundaries must be Client Components
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error mutlaka html ve body etiketlerini içermelidir
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

---

## API Referansı

Bu sayfada bahsedilen özellikler hakkında daha fazla bilgi edinmek için API referanslarını inceleyin:

* [redirect](#) → `redirect` fonksiyonu için API referansı
* [error.js](#) → `error.js` özel dosyası için API referansı
* [notFound](#) → `notFound` fonksiyonu için API referansı
* [not-found.js](#) → `not-found.js` özel dosyası için API referansı


