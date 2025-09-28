# Font Optimizasyonu

`next/font` modülü, fontlarınızı otomatik olarak optimize eder ve harici ağ isteklerini kaldırarak gizlilik ve performansı artırır.

* Herhangi bir font dosyası için **yerleşik self-hosting** desteği vardır.
* Bu sayede web fontlarını **en iyi şekilde yükleyebilir** ve **layout shift** yaşamadan kullanabilirsiniz.

---

## Kullanıma Başlama

`next/font` modülünü `next/font/local` veya `next/font/google` üzerinden import edin, uygun seçeneklerle bir fonksiyon olarak çağırın ve kullanmak istediğiniz elementin `className` özelliğine uygulayın.

```tsx
// app/layout.tsx
import { Geist } from 'next/font/google'
 
const geist = Geist({
  subsets: ['latin'],
})
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

> Fontlar, kullanıldıkları bileşene özel olarak uygulanır. Tüm uygulamaya font uygulamak için **Root Layout** içerisine ekleyin.

---

## Google Font’lar

Herhangi bir Google Font’u otomatik olarak **self-host** edebilirsiniz.
Font dosyaları statik varlıklar olarak dahil edilir ve dağıtımınızın domaininden servis edilir. Bu sayede, kullanıcı sitenizi ziyaret ettiğinde tarayıcı **Google’a istek göndermez**.

Örnek kullanım:

```tsx
// app/layout.tsx
import { Geist } from 'next/font/google'
 
const geist = Geist({
  subsets: ['latin'],
})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

🔹 En iyi performans ve esneklik için **variable font’ları** kullanmanız tavsiye edilir.
Eğer variable font kullanamazsanız, `weight` belirtmeniz gerekir:

```tsx
// app/layout.tsx
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

---

## Yerel Fontlar

Yerel font kullanmak için `next/font/local` üzerinden import edin ve `src` olarak font dosyasının yolunu belirtin.
Fontlar `public` klasöründe veya `app` klasörü içinde saklanabilir.

```tsx
// app/layout.tsx
import localFont from 'next/font/local'
 
const myFont = localFont({
  src: './my-font.woff2',
})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

Bir font ailesi için birden fazla dosya kullanmak isterseniz `src` bir dizi olabilir:

```tsx
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```

---

## API Referansı

Tüm özellikler ve ayrıntılar için:

* [Font API Reference](https://nextjs.org/docs/app/api-reference/next-font)
  Yerleşik `next/font` yükleyicileri ile web fontlarının yüklenmesini optimize edin.
