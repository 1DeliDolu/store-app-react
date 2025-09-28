````markdown
Verileri Güncelleme
Next.js'te verileri React'in Sunucu Fonksiyonlarını (Server Functions) kullanarak güncelleyebilirsiniz. Bu sayfa, Sunucu Fonksiyonlarının nasıl oluşturulup çağrılacağını anlatır.

## Sunucu Fonksiyonları Nedir?
Bir **Sunucu Fonksiyonu**, sunucuda çalışan asenkron bir fonksiyondur. İstemciden ağ isteği aracılığıyla çağrılabilir, bu nedenle mutlaka asenkron olmalıdır.

Bir **eylem (action)** veya **mutasyon (mutation)** bağlamında, bunlara **Sunucu Eylemleri (Server Actions)** da denir.

Geleneksel olarak, bir Sunucu Eylemi `startTransition` ile kullanılan asenkron bir fonksiyondur. Bu otomatik olarak gerçekleşir, eğer fonksiyon:

- Bir `<form>` bileşenine `action` prop’u ile geçirilirse.
- Bir `<button>` bileşenine `formAction` prop’u ile geçirilirse.

Next.js’te Sunucu Eylemleri, framework’ün **önbellekleme mimarisi** ile entegredir. Bir eylem tetiklendiğinde, Next.js hem güncellenmiş UI’ı hem de yeni verileri tek bir sunucu isteği ile döndürebilir.

Arka planda, eylemler **yalnızca POST yöntemi** ile çalışır ve bu HTTP yöntemi dışında çağrılamaz.

---

## Sunucu Fonksiyonları Oluşturma
Bir Sunucu Fonksiyonu, `"use server"` yönergesi kullanılarak tanımlanabilir. Bu yönergeyi:

- Bir asenkron fonksiyonun en üstüne koyarak sadece o fonksiyonu Sunucu Fonksiyonu yapabilirsiniz.
- Veya bir dosyanın en üstüne koyarak, o dosyadaki tüm export edilen fonksiyonları Sunucu Fonksiyonu yapabilirsiniz.

**app/lib/actions.ts**
```typescript
export async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  const content = formData.get('content')
 
  // Veriyi güncelle
  // Önbelleği yeniden doğrula
}
 
export async function deletePost(formData: FormData) {
  'use server'
  const id = formData.get('id')
 
  // Veriyi güncelle
  // Önbelleği yeniden doğrula
}
````

---

## Sunucu Bileşenleri

Sunucu Fonksiyonları, Sunucu Bileşenlerinin içine gömülebilir. Bunun için fonksiyonun gövdesinin en üstüne `"use server"` yönergesi eklenir:

**app/page.tsx**

```typescript
export default function Page() {
  // Sunucu Eylemi
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }
 
  return <></>
}
```

👉 Bilmeniz iyi olur: Sunucu Bileşenleri, **kademeli geliştirmeyi (progressive enhancement)** varsayılan olarak destekler. Yani JavaScript henüz yüklenmemiş veya devre dışı bırakılmış olsa bile, Sunucu Eylemlerini çağıran formlar gönderilmeye devam eder.

---

## İstemci Bileşenleri

İstemci Bileşenlerinde Sunucu Fonksiyonları **tanımlanamaz**. Ancak, `"use server"` yönergesini içeren bir dosyadan import edilerek çağrılabilirler:

**app/actions.ts**

```typescript
'use server'
 
export async function createPost() {}
```

**app/ui/button.tsx**

```typescript
'use client'
 
import { createPost } from '@/app/actions'
 
export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

👉 Bilmeniz iyi olur: İstemci Bileşenlerinde, Sunucu Eylemlerini çağıran formlar **JavaScript yüklenmemişse gönderimleri sıraya alır** ve öncelikli olarak hidrasyona tabi tutulur. Hidrasyon sonrası, form gönderiminde tarayıcı sayfayı yenilemez.

---

## Eylemleri Prop Olarak Geçmek

Bir eylemi, istemci bileşenine prop olarak da geçirebilirsiniz:

```tsx
<ClientComponent updateItemAction={updateItem} />
```

**app/client-component.tsx**

```typescript
'use client'
 
export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```
````markdown
# Sunucu Fonksiyonlarını Çağırma

Bir Sunucu Fonksiyonunu çağırmanın iki ana yolu vardır:

- Sunucu ve İstemci Bileşenlerinde formlar kullanmak  
- İstemci Bileşenlerinde **event handler** (olay yakalayıcılar) ve `useEffect` kullanmak  

👉 Bilmeniz iyi olur: Sunucu Fonksiyonları **sunucu tarafı mutasyonları** için tasarlanmıştır. İstemci şu anda bunları **birer birer** tetikler ve bekler. Bu, uygulama detayıdır ve değişebilir. Paralel veri çekmeye ihtiyacınız varsa, Sunucu Bileşenlerinde veri çekmeyi kullanın veya tek bir Sunucu Fonksiyonu ya da Route Handler içinde paralel işlem yapın.

---

## Formlar
React, HTML `<form>` elementini genişleterek Sunucu Fonksiyonlarının `action` prop’u ile çağrılmasını sağlar.

Form ile çağrıldığında, fonksiyon otomatik olarak `FormData` nesnesini alır. Veriyi, `FormData`’nın yerleşik metodlarıyla çıkarabilirsiniz:

**app/ui/form.tsx**
```typescript
import { createPost } from '@/app/actions'
 
export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
````

**app/actions.ts**

```typescript
'use server'
 
export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
 
  // Veriyi güncelle
  // Önbelleği yeniden doğrula
}
```

---

## Event Handler’lar

Sunucu Fonksiyonlarını, İstemci Bileşenlerinde `onClick` gibi event handler’larla çağırabilirsiniz:

**app/like-button.tsx**

```typescript
'use client'
 
import { incrementLike } from './actions'
import { useState } from 'react'
 
export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
 
  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

---

## Örnekler

### Bekleme durumu gösterme

Bir Sunucu Fonksiyonu çalışırken, `useActionState` hook’unu kullanarak bir yükleniyor göstergesi (loading indicator) sunabilirsiniz. Bu hook, `pending` isimli bir boolean döner:

**app/ui/button.tsx**

```typescript
'use client'
 
import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'
 
export function Button() {
  const [state, action, pending] = useActionState(createPost, false)
 
  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

---

### Yeniden doğrulama

Bir güncellemeden sonra, Next.js önbelleğini yeniden doğrulamak ve güncel veriyi göstermek için `revalidatePath` veya `revalidateTag` fonksiyonlarını Sunucu Fonksiyonu içinde çağırabilirsiniz:

**app/lib/actions.ts**

```typescript
import { revalidatePath } from 'next/cache'
 
export async function createPost(formData: FormData) {
  'use server'
  // Veriyi güncelle
  // ...
 
  revalidatePath('/posts')
}
```

---

### Yönlendirme

Bir güncellemeden sonra kullanıcıyı farklı bir sayfaya yönlendirmek isteyebilirsiniz. Bunun için `redirect` fonksiyonunu çağırabilirsiniz:

**app/lib/actions.ts**

```typescript
'use server'
 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
 
export async function createPost(formData: FormData) {
  // Veriyi güncelle
  // ...
 
  revalidatePath('/posts')
  redirect('/posts')
}
```

`redirect` çağırıldığında, framework tarafından yönetilen bir **control-flow exception** fırlatılır. Bu yüzden sonrasında yazdığınız kod çalışmaz. Taze veri gerekiyorsa, `revalidatePath` veya `revalidateTag`’i önce çağırın.

---

### Çerezler (Cookies)

Sunucu Eylemleri içinde, `cookies` API’sini kullanarak çerezleri alabilir, ayarlayabilir veya silebilirsiniz.

Bir çerezi ayarladığınızda veya sildiğinizde, Next.js **mevcut sayfayı ve layout’larını sunucuda yeniden render eder**, böylece UI yeni çerez değerini yansıtır.

👉 Bilmeniz iyi olur: Sunucu güncellemesi, mevcut React ağacına uygulanır. Gerekirse bileşenler yeniden render edilir, mount veya unmount edilir. İstemci tarafı state korunur ve bağımlılıkları değişen effect’ler tekrar çalışır.

**app/actions.ts**

```typescript
'use server'
 
import { cookies } from 'next/headers'
 
export async function exampleAction() {
  const cookieStore = await cookies()
 
  // Çerezi al
  cookieStore.get('name')?.value
 
  // Çerezi ayarla
  cookieStore.set('name', 'Delba')
 
  // Çerezi sil
  cookieStore.delete('name')
}
```

---

## useEffect

`useEffect` hook’unu kullanarak, bileşen mount olduğunda veya bir bağımlılık değiştiğinde bir Sunucu Eylemi tetikleyebilirsiniz. Bu, global olaylara bağlı mutasyonlar veya otomatik tetiklenmesi gereken işlemler için yararlıdır.
Örneğin: `onKeyDown` ile uygulama kısayolları, sonsuz kaydırma için intersection observer hook’u, veya bileşen mount olduğunda **görüntülenme sayısını güncellemek** için.

**app/view-count.tsx**

```typescript
'use client'
 
import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'
 
export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()
 
  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])
 
  // Kullanıcıya geri bildirim vermek için `isPending` kullanılabilir
  return <p>Total Views: {views}</p>
}
```

---

## API Referansı

Bu sayfada geçen özellikler hakkında daha fazla bilgi için API Referanslarını inceleyin:

* [**revalidatePath**](#) → `revalidatePath` fonksiyonunun API Referansı
* [**revalidateTag**](#) → `revalidateTag` fonksiyonunun API Referansı
* [**redirect**](#) → `redirect` fonksiyonunun API Referansı



