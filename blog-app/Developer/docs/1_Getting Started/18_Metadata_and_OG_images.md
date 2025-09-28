# Metadata ve OG Görselleri

Metadata API’leri, uygulamanızın metadata bilgilerini tanımlamak için kullanılabilir. Bu, SEO’yu ve web’de paylaşılabilirliği iyileştirir. Şunları içerir:

* Statik metadata nesnesi
* Dinamik `generateMetadata` fonksiyonu
* Statik veya dinamik olarak oluşturulabilen favicon ve OG görselleri için özel dosya kuralları

Yukarıdaki tüm seçeneklerle, Next.js sayfanız için ilgili `<head>` etiketlerini otomatik olarak oluşturur. Bunları tarayıcı geliştirici araçlarında inceleyebilirsiniz.

`metadata` nesnesi ve `generateMetadata` fonksiyonu yalnızca **Server Components** içinde desteklenir.

---

## Varsayılan Alanlar

Bir rota metadata tanımlamasa bile her zaman eklenen iki varsayılan meta etiketi vardır:

* `meta charset` etiketi sitenin karakter kodlamasını ayarlar.
* `meta viewport` etiketi sitenin farklı cihazlara göre genişlik ve ölçeklendirmesini ayarlar.

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Diğer metadata alanları ise `Metadata` nesnesi (statik metadata için) veya `generateMetadata` fonksiyonu (dinamik metadata için) ile tanımlanabilir.

---

## Statik Metadata

Statik metadata tanımlamak için `layout.js` veya `page.js` dosyasından bir `Metadata` nesnesi export edin. Örneğin, blog rotasına başlık ve açıklama eklemek için:

```tsx
// app/blog/layout.tsx
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}
 
export default function Layout() {}
```

Tüm kullanılabilir seçenekleri `generateMetadata` dokümantasyonunda görebilirsiniz.

---

## Dinamik Metadata

Verilere bağlı metadata çekmek için `generateMetadata` fonksiyonunu kullanabilirsiniz. Örneğin, belirli bir blog yazısı için başlık ve açıklamayı almak için:

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
 
  // yazı bilgilerini çek
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )
 
  return {
    title: post.title,
    description: post.description,
  }
}
 
export default function Page({ params, searchParams }: Props) {}
```

---

## Metadata Streaming

Dinamik olarak render edilen sayfalarda, `generateMetadata` fonksiyonunun çözülmesi render’ı engelleyebilecekse, Next.js metadata’yı ayrı olarak stream eder ve hazır olur olmaz HTML içine enjekte eder.

Statik render edilen sayfalarda bu davranış kullanılmaz çünkü metadata build-time’da çözülür.

Daha fazla bilgi için **streaming metadata** dokümantasyonuna bakın.

---

## Veri Taleplerini Memoize Etme

Hem metadata hem de sayfa için aynı veriyi çekmeniz gerekebilir. Çift isteği önlemek için React’ın `cache` fonksiyonunu kullanarak sonucu memoize edebilirsiniz. Örneğin:

```tsx
// app/lib/data.ts
import { cache } from 'react'
import { db } from '@/app/lib/db'
 
// getPost iki kez kullanılacak ama yalnızca bir kez çalışacak
export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

```tsx
// app/blog/[slug]/page.tsx
import { getPost } from '@/app/lib/data'
 
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.description,
  }
}
 
export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <div>{post.title}</div>
}
```

---

## Dosya Tabanlı Metadata

Metadata için kullanılabilen özel dosyalar şunlardır:

* `favicon.ico`, `apple-icon.jpg`, `icon.jpg`
* `opengraph-image.jpg`, `twitter-image.jpg`
* `robots.txt`
* `sitemap.xml`

Bunları statik metadata olarak kullanabilir veya kodla programatik olarak üretebilirsiniz.

---

### Favicons

Favicon’lar, sitenizi yer imlerinde ve arama sonuçlarında temsil eden küçük simgelerdir.
Bir favicon eklemek için `favicon.ico` dosyasını oluşturun ve `app` klasörünün köküne ekleyin.

![alt text](18/image.png)

Ayrıca, favicon’ları programatik olarak kodla da üretebilirsiniz. Daha fazla bilgi için favicon dokümantasyonuna bakın.

---

## Statik Open Graph Görselleri

Open Graph (OG) görselleri, sitenizi sosyal medyada temsil eden görsellerdir.
Uygulamanıza statik bir OG görseli eklemek için, `app` klasörünün köküne bir **opengraph-image.png** dosyası oluşturun.


![alt text](18/image-1.png)

Belirli rotalar için de OG görselleri ekleyebilirsiniz. Bunun için klasör yapısında daha derine bir **opengraph-image.png** dosyası oluşturun.

Örneğin, `/blog` rotasına özel bir OG görseli eklemek için, **blog** klasörünün içine bir **opengraph-image.jpg** dosyası ekleyin.


![alt text](18/image-2.png)


Daha spesifik bir görsel, klasör yapısındaki üst seviyelerde bulunan OG görsellerine göre öncelikli olacaktır.

Ayrıca, **jpeg**, **png** ve **gif** gibi diğer görsel formatları da desteklenir. Daha fazla bilgi için Open Graph Image dokümantasyonuna bakabilirsiniz.

---

## Dinamik Open Graph Görselleri

`ImageResponse` constructor’ı, JSX ve CSS kullanarak dinamik görseller üretmenize olanak tanır. Bu, veriye bağlı OG görselleri için faydalıdır.

Örneğin, her blog yazısı için benzersiz bir OG görseli oluşturmak için **blog** klasörüne bir `opengraph-image.ts` dosyası ekleyin ve `ImageResponse` constructor’ını `next/og` içinden içe aktarın:

```tsx
// app/blog/[slug]/opengraph-image.ts
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'
 
// Görsel metadata bilgileri
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
// Görsel oluşturma
export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
 
  return new ImageResponse(
    (
      // ImageResponse JSX elemanı
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

`ImageResponse`, yaygın CSS özelliklerini destekler; bunlara **flexbox**, **absolute positioning**, özel fontlar, metin kaydırma, ortalama ve iç içe görseller dahildir. Desteklenen tüm CSS özelliklerinin tam listesine göz atabilirsiniz.

---

### Bilmeniz İyi Olur:

* Örnekler için **Vercel OG Playground**’u inceleyebilirsiniz.
* `ImageResponse`, **@vercel/og**, **satori** ve **resvg** kullanarak HTML ve CSS’i PNG’ye dönüştürür.
* Yalnızca flexbox ve CSS özelliklerinin bir alt kümesi desteklenir. Gelişmiş düzenler (ör. `display: grid`) çalışmaz.

---

## API Referansı

Bu sayfada geçen Metadata API’leri hakkında daha fazla bilgi:

* **generateMetadata** → Next.js uygulamanıza SEO ve paylaşılabilirlik için metadata ekleme
* **generateViewport** → `generateViewport` fonksiyonu için API referansı
* **ImageResponse** → `ImageResponse` constructor’ı için API referansı
* **Metadata Files** → Metadata dosya kuralları için API dokümantasyonu
* **favicon, icon, apple-icon** → Favicon, Icon ve Apple Icon dosya kuralları
* **opengraph-image ve twitter-image** → Open Graph Image ve Twitter Image dosya kuralları
* **robots.txt** → `robots.txt` dosyası için API referansı
* **sitemap.xml** → `sitemap.xml` dosyası için API referansı
