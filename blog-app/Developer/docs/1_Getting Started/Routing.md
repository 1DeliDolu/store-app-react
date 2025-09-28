# Next.js (app) yönlendirme – özet

Aşağıda Next.js 13+ "app router" kullanılarak yapılan dosya tabanlı yönlendirme (routing) açıklanmıştır.

## 1. Temel fikir

- app/ klasörü altındaki her klasör bir "segment" (yol parçası) olur.
- Her segment içinde `page.tsx` bulunduğunda o segment için bir sayfa oluşur.
- Yönlendirme dosya-sistemi tabanlıdır: klasör yapısı URL yapısını belirler.

## 2. Önemli dosyalar ve görevleri

- `page.tsx` : O segment için sayfa bileşeni.
- `layout.tsx` : O segment ve alt segmentleri için ortak layout (paylaşılan UI).
- `loading.tsx` : O segment yüklenirken gösterilecek içerik.
- `error.tsx` : O segment veya alt segmentlerde oluşan hatalar için fallback.
- `head.tsx` (veya metadata export) : Sayfa başlığı/metadata.
- `route.ts` : HTTP route handler (GET/POST vb.) — API benzeri handler, sayfadan ayrı.

## 3. Dinamik yönlendirme

- Tek parametre: `[id]` → örn. `/app/posts/[id]/page.tsx` → `/posts/123`
- Catch-all: `[...slug]` → tüm kalan segmentleri yakalar: `/posts/a/b/c`
- Optional catch-all: `[[...slug]]` → parametre olmayabilir de

Örnek:

- `app/posts/[id]/page.tsx` içinde parametreye erişim:
  - Server component: `export default function Page({ params }: { params: { id: string } }) { ... }`

## 4. Nested/layout mantığı

- `layout.tsx` bir segmentin ortak UI'sını sağlar (ör: header, footer).
- Layout'lar iç içe geçer; en üst layout tüm sayfalar için geçerlidir.
- Layout içindeki `children` alt segmentlerin render edildiği yerdir.

## 5. Route Groups ve Parallel Routes

- Route group: `app/(auth)/login/page.tsx` gibi parantezli klasörler URL'ye dahil edilmez; UI organizasyonu içindir.
- Parallel routes ve intercepting routes daha gelişmiş senaryolar içindir; kullanımı segment isimleri ve `@` benzeri yapılandırmalarla yapılır.

## 6. Server vs Client bileşenleri

- app router varsayılan olarak Server Components kullanır.
- Client bileşeni yapmak için dosyanın en başına `"use client"` eklenir.
- Router hook'ları (örn. `useRouter`, `usePathname`, `useSearchParams`) yalnızca client bileşenlerde çalışır.
- Server component içinde navigation için Link veya redirect/headers gibi server API'ları kullanılır.

## 7. Link ve navigasyon

- Client tarafı link: `import Link from 'next/link'` kullanın.
- Programlı yönlendirme: client bileşende `useRouter().push('/path')` ya da `useRouter().replace(...)`.
- Server'da yönlendirme: `redirect('/path')` (server action veya page fonksiyonu içinde).

## 8. route.ts (Route handlers)

- `app/some/route.ts` içinde `export async function GET(request: Request) { ... }` gibi handler'lar tanımlanır.
- API benzeri davranış sağlar; SSR page'lerden ayrı olarak çalışır.

## 9. Örnek dosya ağacı

- app/
  - layout.tsx
  - page.tsx
  - loading.tsx
  - error.tsx
  - head.tsx
  - posts/
    - layout.tsx
    - page.tsx
    - [id]/
      - page.tsx
  - (auth)/
    - login/
      - page.tsx

## 10. Küçük örnekler

Server page (dinamik parametre):

```tsx
// Örnek: app/posts/[id]/page.tsx
export default function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  // fetch veri sunucu tarafında
  return <div>Post: {id}</div>;
}
```

Client bileşeninde navigasyon:

```tsx
// Örnek: app/components/LikeButton.tsx
"use client";
import { useRouter } from "next/navigation";
export default function LikeButton() {
  const router = useRouter();
  return <button onClick={() => router.push("/thanks")}>Like</button>;
}
```

Route handler:

```ts
// Örnek: app/api/hello/route.ts
export async function GET() {
  return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
}
```

## 11. İpuçları ve sık hatalar

- `useRouter` ve diğer client hook'ları server bileşenlerde çalışmaz; `"use client"` unutulursa hata alırsınız.
- `layout.tsx` içinde server-only kod yazabilirsiniz; bunun child'lara etkisini göz önünde bulundurun.
- Dosya isimlendirmelerine dikkat: büyük/küçük harf Hataları Windows'ta nadir, ama sunucu ortamında problem olabilir.
- Route group kullanarak URL'yi değiştirmeden component organizasyonu yapabilirsiniz.

Bu özet, app router ile yönlendirme mantığını kavramanız için yeterli olmalı. Örnekleri kendi projenize uyarlarken `params`, `children`, ve `"use client"` kurallarına dikkat edin.
