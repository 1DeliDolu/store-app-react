````markdown
# PPR
Bu özellik şu anda canary kanalında mevcuttur ve değişime tabidir. Next.js sürümünüzü yükselterek deneyin ve GitHub üzerinden geri bildirimlerinizi paylaşın.  
Kısmi Önceden Oluşturma (Partial Prerendering - PPR), aynı rotada statik ve dinamik bileşenleri bir arada kullanmanıza olanak tanır. PPR hakkında daha fazla bilgi edinin.

## Kısmi Önceden Oluşturmayı Kullanma

### Artırımlı Benimseme (Sürüm 15)
Next.js 15’te, `next.config.js` dosyasında `ppr` seçeneğini `incremental` olarak ayarlayarak ve dosyanın en üstünde `experimental_ppr` rota yapılandırma seçeneğini dışa aktararak, layout ve sayfalarda Kısmi Önceden Oluşturmayı adım adım benimseyebilirsiniz:

**next.config.ts**  
_TypeScript_
```ts
import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}
 
export default nextConfig
````

**app/page.tsx**
*TypeScript*

```ts
import { Suspense } from "react"
import { StaticComponent, DynamicComponent, Fallback } from "@/app/ui"
 
export const experimental_ppr = true
 
export default function Page() {
  return {
     <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
     </>
  };
}
```

## Bilmeniz Gerekenler

* `experimental_ppr` tanımlı olmayan rotalar varsayılan olarak `false` olur ve PPR ile önceden oluşturulmaz. Her rota için açıkça PPR’a dahil etmeniz gerekir.
* `experimental_ppr`, route segmentinin tüm alt öğelerine (nested layout ve page’ler dahil) uygulanır. Her dosyaya eklemenize gerek yoktur, yalnızca rota segmentinin en üstüne eklemek yeterlidir.
* Alt segmentlerde PPR’ı devre dışı bırakmak için, `experimental_ppr` değerini `false` olarak ayarlayabilirsiniz.

## Sürüm Değişiklikleri

| Sürüm   | Değişiklikler                         |
| ------- | ------------------------------------- |
| v15.0.0 | Deneysel `incremental` değeri eklendi |
| v14.0.0 | Deneysel `ppr` tanıtıldı              |


