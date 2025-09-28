````markdown
# CSS

Next.js, uygulamanızı CSS kullanarak stillendirmenin birkaç yolunu sağlar:

- Tailwind CSS  
- CSS Modülleri  
- Global CSS  
- Harici Stil Dosyaları  
- Sass  
- CSS-in-JS  

---

## Tailwind CSS

Tailwind CSS, özel tasarımlar oluşturmak için düşük seviyeli yardımcı sınıflar sağlayan bir utility-first CSS framework’üdür.

### Tailwind CSS’i yükleyin:

**pnpm**  
**npm**  
**yarn**  
**bun**

```bash
pnpm add -D tailwindcss @tailwindcss/postcss
````

### PostCSS eklentisini `postcss.config.mjs` dosyanıza ekleyin:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### Tailwind’i global CSS dosyanıza import edin:

`app/globals.css`

```css
@import 'tailwindcss';
```

### CSS dosyasını root layout’a import edin:

`app/layout.tsx`

```tsx
import './globals.css'
 
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

### Artık Tailwind sınıflarını kullanabilirsiniz:

`app/page.tsx`

```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

**Bilmeniz iyi olur:** Çok eski tarayıcılar için daha geniş destek gerekiyorsa Tailwind CSS v3 kurulum talimatlarına bakın.

---

## CSS Modülleri

CSS Modülleri, her dosya için benzersiz sınıf isimleri üreterek CSS’i yerel olarak sınırlar. Bu, aynı sınıf adını farklı dosyalarda çakışma olmadan kullanmanıza olanak tanır.

Bir `.module.css` uzantılı dosya oluşturun ve `app` dizini içindeki herhangi bir bileşene import edin:

`app/blog/blog.module.css`

```css
.blog {
  padding: 24px;
}
```

`app/blog/page.tsx`

```tsx
import styles from './blog.module.css'
 
export default function Page() {
  return <main className={styles.blog}></main>
}
```

---

## Global CSS

Uygulamanız genelinde geçerli olacak stiller için global CSS kullanabilirsiniz.

`app/global.css` dosyası oluşturun ve root layout’a import edin:

`app/global.css`

```css
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

`app/layout.tsx`

```tsx
// Bu stiller uygulamadaki tüm rotalara uygulanır
import './global.css'
 
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

**Bilmeniz iyi olur:** Global stiller, `app` dizini içindeki herhangi bir layout, sayfa veya bileşene import edilebilir. Ancak Next.js, Suspense ile entegre olmak için React’ın dahili stil dosyası desteğini kullandığından, rotalar arasında gezinirken stil dosyaları kaldırılmaz ve bu durum çakışmalara yol açabilir.
Bu nedenle global stilleri yalnızca **gerçekten global** CSS için kullanın (örneğin Tailwind’in base stilleri).
Bileşen stilleri için Tailwind CSS, özel kapsüllü stiller için CSS Modülleri tercih edin.

---

## Harici Stil Dosyaları

Harici paketler tarafından yayımlanan stil dosyaları, `app` dizininde herhangi bir yere import edilebilir:

`app/layout.tsx`

```tsx
import 'bootstrap/dist/css/bootstrap.css'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

**Bilmeniz iyi olur:** React 19’da `<link rel="stylesheet" href="..." />` da kullanılabilir. Daha fazla bilgi için React link dokümantasyonuna bakın.

---

## Sıralama ve Birleştirme

Next.js, üretim derlemelerinde CSS’i otomatik olarak parçalara ayırır (birleştirir). CSS sırası, kodunuzda stilleri import etme sırasına bağlıdır.

Örneğin, `<BaseButton>` `page.module.css`’ten önce import edildiği için `base-button.module.css` önce sıralanır:

`page.tsx`

```tsx
import { BaseButton } from './base-button'
import styles from './page.module.css'
 
export default function Page() {
  return <BaseButton className={styles.primary} />
}
```

`base-button.tsx`

```tsx
import styles from './base-button.module.css'
 
export function BaseButton() {
  return <button className={styles.primary} />
}
```

---

## Öneriler

CSS sıralamasını öngörülebilir tutmak için:

* CSS importlarını tek bir giriş dosyasında toplayın.
* Global stilleri ve Tailwind stil dosyalarını uygulamanızın köküne import edin.
* Çoğu stil ihtiyacınız için Tailwind CSS kullanın.
* Tailwind yeterli olmadığında bileşen özelinde CSS Modülleri tercih edin.
* Tutarlı bir adlandırma standardı kullanın (örn. `<name>.module.css`).
* Paylaşılan stilleri, yinelenen importlardan kaçınmak için ortak bileşenlere çıkarın.
* ESLint’in `sort-imports` gibi importları otomatik sıralayan kurallarını devre dışı bırakın.
* CSS’in nasıl parçalara ayrıldığını kontrol etmek için `next.config.js` içindeki `cssChunking` seçeneğini kullanın.

---

## Geliştirme ve Üretim

* **Geliştirme (`next dev`)**: CSS, Fast Refresh ile anında güncellenir.
* **Üretim (`next build`)**: Tüm CSS dosyaları otomatik olarak birleştirilir, küçültülür ve route bazlı parçalanır.
* CSS, üretimde JavaScript kapalıyken de yüklenir, ancak geliştirmede Fast Refresh için JS gereklidir.
* CSS sıralaması geliştirme ve üretimde farklı davranabilir. Daima `next build` sonrası son hali kontrol edin.

---

## Sonraki Adımlar

Uygulamanızda CSS kullanmanın alternatif yollarını öğrenin:

* [Tailwind CSS v3](#)
* [Sass](#)
* [CSS-in-JS](#)


