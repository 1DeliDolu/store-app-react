# Önbellekleme ve Yeniden Doğrulama

Önbellekleme, veri çekme ve diğer hesaplamaların sonucunu saklama tekniğidir. Böylece aynı veriye yönelik gelecekteki istekler daha hızlı yanıtlanabilir, işlemleri yeniden yapmaya gerek kalmaz. Yeniden doğrulama (revalidation) ise tüm uygulamayı baştan oluşturmak zorunda kalmadan önbellek girişlerini güncellemeye olanak tanır.

Next.js, önbellekleme ve yeniden doğrulama işlemleri için birkaç API sağlar. Bu rehber, ne zaman ve nasıl kullanılacağını açıklamaktadır.

* `fetch`
* `unstable_cache`
* `revalidatePath`
* `revalidateTag`

---

## fetch

Varsayılan olarak `fetch` istekleri önbelleğe alınmaz. Bireysel istekleri önbelleğe almak için `cache` seçeneğini `'force-cache'` olarak ayarlayabilirsiniz.

**app/page.tsx**

```tsx
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

💡 **Bilmekte fayda var:**
`fetch` istekleri varsayılan olarak önbelleğe alınmasa da, Next.js bu istekleri içeren rotaları **önceden işler (prerender)** ve HTML’yi önbelleğe alır. Bir rotanın dinamik olmasını garanti etmek için **connection API** kullanabilirsiniz.

Verilerin belirli aralıklarla yeniden doğrulanmasını istiyorsanız, `next.revalidate` seçeneğini kullanabilirsiniz:

```tsx
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

Bu örnekte, veri her 3600 saniyede bir yeniden doğrulanır.

➡️ Daha fazla bilgi için **fetch API referansına** bakın.

---

## unstable_cache

`unstable_cache`, veritabanı sorguları ve diğer async fonksiyonların sonucunu önbelleğe almanızı sağlar. Kullanmak için ilgili fonksiyonu `unstable_cache` ile sarmalayın.

**app/lib/data.ts**

```ts
import { db } from '@/lib/db'

export async function getUserById(id: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((res) => res[0])
}
```

**app/page.tsx**

```tsx
import { unstable_cache } from 'next/cache'
import { getUserById } from '@/app/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
 
  const getCachedUser = unstable_cache(
    async () => {
      return getUserById(userId)
    },
    [userId] // kullanıcı ID'sini önbellek anahtarına ekle
  )
}
```

Fonksiyon üçüncü opsiyonel bir nesne kabul eder. Bu nesne önbelleğin nasıl yeniden doğrulanacağını tanımlar:

* `tags`: Next.js’in önbelleği yeniden doğrulamak için kullandığı etiketler
* `revalidate`: önbelleğin kaç saniye sonra yeniden doğrulanacağı

```tsx
const getCachedUser = unstable_cache(
  async () => {
    return getUserById(userId)
  },
  [userId],
  {
    tags: ['user'],
    revalidate: 3600,
  }
)
```

➡️ Daha fazla bilgi için **unstable_cache API referansına** bakın.

---

## revalidateTag

`revalidateTag`, belirli bir **etikete** bağlı önbellek girişlerini bir olay sonrasında yeniden doğrulamak için kullanılır.

Önce `fetch` fonksiyonunu `next.tags` ile etiketleyin:

**app/lib/data.ts**

```ts
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: {
      tags: ['user'],
    },
  })
}
```

Alternatif olarak, `unstable_cache` fonksiyonunu etiketlerle işaretleyebilirsiniz:

```ts
export const getUserById = unstable_cache(
  async (id: string) => {
    return db.query.users.findFirst({ where: eq(users.id, id) })
  },
  ['user'], // değişkenler parametre olarak geçilmezse gereklidir
  {
    tags: ['user'],
  }
)
```

Sonrasında, `revalidateTag` fonksiyonunu bir Route Handler veya Server Action içinde çağırabilirsiniz:

**app/lib/actions.ts**

```ts
import { revalidateTag } from 'next/cache'
 
export async function updateUser(id: string) {
  // Veriyi güncelle
  revalidateTag('user')
}
```

Aynı etiketi birden fazla fonksiyonda kullanarak hepsini aynı anda yeniden doğrulayabilirsiniz.

➡️ Daha fazla bilgi için **revalidateTag API referansına** bakın.

---

## revalidatePath

`revalidatePath`, belirli bir **rota**yı bir olay sonrasında yeniden doğrulamak için kullanılır. Bunu bir Route Handler veya Server Action içinde çağırabilirsiniz:

**app/lib/actions.ts**

```ts
import { revalidatePath } from 'next/cache'
 
export async function updateUser(id: string) {
  // Veriyi güncelle
  revalidatePath('/profile')
}
```

➡️ Daha fazla bilgi için **revalidatePath API referansına** bakın.

---

## API Referansı

Bu sayfada bahsedilen özellikler hakkında daha fazla bilgi edinmek için ilgili API referanslarını inceleyin:

* [fetch](#) → Genişletilmiş fetch fonksiyonu için API referansı
* [unstable_cache](#) → unstable_cache fonksiyonu için API referansı
* [revalidatePath](#) → revalidatePath fonksiyonu için API referansı
* [revalidateTag](#) → revalidateTag fonksiyonu için API referansı


