````markdown
'use client'  
'use client' yönergesi, bileşenlerin istemci tarafında render edilmesi için bir giriş noktası tanımlar ve istemci tarafı JavaScript özellikleri gerektiren (ör. durum yönetimi, olay işleme, tarayıcı API'lerine erişim gibi) etkileşimli kullanıcı arayüzleri (UI) oluştururken kullanılmalıdır. Bu, bir React özelliğidir.

İyi bilmekte fayda var:

- Her **Client Component** içeren dosyaya `'use client'` eklemeniz gerekmez. Yalnızca bileşenlerini doğrudan **Server Component** içinde render etmek istediğiniz dosyalara eklemeniz gerekir.  
- `'use client'` yönergesi istemci-sunucu sınırını tanımlar ve bu dosyadan dışa aktarılan bileşenler istemciye giriş noktası olarak hizmet eder.

---

## Kullanım

Bir Client Component için giriş noktası tanımlamak amacıyla, `'use client'` yönergesini dosyanın en üstüne, herhangi bir import’tan önce ekleyin:

**app/components/counter.tsx**  
TypeScript

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
````

---

## Serileştirilebilir Props

`'use client'` yönergesini kullandığınızda, Client Component'lerin props’ları serileştirilebilir olmalıdır. Bu, React’in sunucudan istemciye veri gönderirken props’ları serileştirebileceği bir formatta olmaları gerektiği anlamına gelir.

**app/components/counter.tsx**
TypeScript

```tsx
'use client'

export default function Counter({
  onClick /* ❌ Fonksiyon serileştirilebilir değildir */,
}) {
  return (
    <div>
      <button onClick={onClick}>Increment</button>
    </div>
  )
}
```

---

## Server ve Client Component'leri İç İçe Kullanma

Server ve Client Component'leri birleştirmek, hem yüksek performanslı hem de etkileşimli uygulamalar oluşturmanıza olanak tanır:

* **Server Components**: Statik içerik, veri çekme, SEO dostu öğeler için kullanılır.
* **Client Components**: Durum, efekt veya tarayıcı API’leri gerektiren etkileşimli öğeler için kullanılır.
* **Bileşen kompozisyonu**: Gerektiğinde Client Component’leri Server Component’lerin içine yerleştirerek istemci ve sunucu mantığını net bir şekilde ayırabilirsiniz.

Aşağıdaki örnekte:

* **Header**, statik içeriği yöneten bir **Server Component**’tir.
* **Counter**, sayfa içinde etkileşim sağlayan bir **Client Component**’tir.

**app/page.tsx**
TypeScript

```tsx
import Header from './header'
import Counter from './counter' // Bu bir Client Component

export default function Page() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  )
}
```


