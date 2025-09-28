npm install @mui/material @emotion/react @emotion/styled

## MUI değişiklikleri - kısa açıklama

Aşağıda `src/components/ButtonUsage.jsx` ve `src/layouts/MainLayout.jsx` dosyalarında yapılan değişikliklerin ve eklenen MUI bağımlılıklarının ne işe yaradığının özeti yer alır.

### ButtonUsage.jsx

- Ne yapıyor:

  - `@mui/material` içinden `Button` bileşenini import ederek iki adet Material UI butonu render ediyor: biri `contained`, diğeri `outlined` variant ile.
  - Bu bileşen MUI'nin hazır stillendirilmiş, erişilebilir düğmelerini kullanır; proje içinde MUI bileşenlerini nasıl kullanabileceğinize dair basit bir örnektir.

- Örnek kod (projedeki hali):

  import React from 'react'
  import Button from '@mui/material/Button'

  export default function ButtonUsage() {
  return (
  <div>
  <Button variant="contained" color="primary">Primary Button</Button>
  <Button variant="outlined" color="secondary">Secondary Button</Button>
  </div>
  )
  }

### MainLayout.jsx

- Ne yapıyor/eklendi:

  - `MainLayout` içerisine `ButtonUsage` bileşeni eklendi; böylece uygulamanın layout'unda örnek MUI butonları gösteriliyor.
  - Ayrıca layout içinde `Outlet` kullanılarak nested route içerikleri render ediliyor.

- Dikkat edilmesi gereken nokta:
  - Mevcut import satırında `Outlet` şu şekilde import edilmiş: `import { Outlet } from 'react-router'`.
  - Doğru kullanım `react-router-dom` üzerinden olmalıdır: `import { Outlet } from 'react-router-dom'`.
  - Windows üzerinde bu çalışsa da (case-insensitive/lenient), cross-platform uyumluluk ve resmi örneklere uygunluk için `react-router-dom` kullanımı tavsiye edilir.

### MUI paketlerinin ne işe yaradığı

- `@mui/material` — Material UI bileşen kütüphanesinin ana paketi. Button, AppBar, Card, Grid gibi hazır React bileşenleri sağlar. Temel UI bileşenlerini kullanmak için bu paket gereklidir.
- `@emotion/react` ve `@emotion/styled` — MUI v5'te varsayılan stil motoru olarak Emotion kullanılır. `@emotion/react` runtime ve css yardımcıları, `@emotion/styled` ise styled API'si sağlar. Bu iki paket MUI bileşenlerinin stilini çalıştırmak için gereklidir.

Opsiyonel ve sık kullanılan ek paketler

- `@mui/icons-material` — MUI için Material Icons icon set'ini sağlar; `npm install @mui/icons-material` ile eklenebilir.

Kurulum ve hızlı doğrulama

1. Bağımlılıkları yükleyin:

   npm install @mui/material @emotion/react @emotion/styled

2. Geliştirme sunucusunu başlatın:

   npm run dev

3. Tarayıcıda uygulamayı açın (varsayılan port proje ayarlarına göre değişir; bizim yapılandırmada Vite `server.port: 3000` olarak ayarlanmış olabilir):

   http://localhost:3000

4. MainLayout görünürken MUI butonları sayfada gösterilecektir. Eğer butonları göremezseniz konsolda import hatası veya eksik paket uyarısı olup olmadığına bakın.

Notlar ve öneriler

- Uygulamada daha tutarlı kullanım için `MainLayout.jsx` içindeki `Outlet` importunu `react-router-dom` ile değiştirin.
- MUI'yi tam olarak kullanmadan önce projenizde global bir theme veya CssBaseline eklemek iyi olur; örn. `import CssBaseline from '@mui/material/CssBaseline'` ve `ThemeProvider` kullanımıyla temel stil tutarlılığı sağlanır.
