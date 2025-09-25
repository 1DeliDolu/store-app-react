MUI (Material UI) - Kurulum ve Hızlı Başlangıç

Bu dosya projeye Material UI (MUI) eklemek ve temel kullanım için hızlı notlar içerir.

1. Paketlerin yüklenmesi

Proje kökünde aşağıdaki paketleri yükleyin:

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto

- `@mui/material` — MUI bileşen kütüphanesinin ana paketi.
- `@emotion/react` ve `@emotion/styled` — MUI v5'te varsayılan stil motoru Emotion olduğu için gerekli stil paketleri.
- `@mui/icons-material` — Material Icons seti (opsiyonel, fakat sık kullanılır).
- `@fontsource/roboto` — Roboto fontunu yerel olarak kullanmak için (MUI'nin önerdiği yazı tipi).

2. Fontların projeye eklenmesi

`src/index.css` içine şu satırların eklenmiş olması yeterlidir (projede zaten var):

@import '@fontsource/roboto/300.css';
@import '@fontsource/roboto/400.css';
@import '@fontsource/roboto/500.css';
@import '@fontsource/roboto/700.css';

Bu importlar `@fontsource/roboto` paketinin yüklenmesini gerektirir. Paket yüklendikten sonra Vite/webpack importları resolve edecek ve fontlar kullanılabilir hale gelecektir.

3. Global stil ve theme (önerilen başlangıç)

Uygulama girişine (ör. `src/main.jsx` veya `src/App.jsx` layout içinde) `CssBaseline` ve `ThemeProvider` ekleyin:

- Örnek (kısa):

  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import { ThemeProvider, createTheme } from '@mui/material/styles'
  import CssBaseline from '@mui/material/CssBaseline'
  import App from './App'

  const theme = createTheme({ /_ tema ayarları _/ })

  ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
  </ThemeProvider>
  )

4. Mevcut komponentlerde kısa notlar

- `src/components/ButtonUsage.jsx` — örnek olarak `@mui/material/Button` kullanıyor. Eğer paketler yüklüyse bu bileşen sorunsuz çalışır.
- `src/layouts/MainLayout.jsx` — layout içine `ButtonUsage` eklendi. `Outlet` importunun `react-router-dom` üzerinden olması gerektiğini unutmayın: `import { Outlet } from 'react-router-dom'`.

### ButtonUsage.jsx (detaylı)

`src/components/ButtonUsage.jsx` dosyası projede MUI'nin `Button` bileşenini gösteren basit bir örnektir. Bu dosya, MUI paketleri yüklendiğinde hemen çalışır ve Material tasarımına uygun butonlar render eder.

Örnek kod (projede mevcut):

```javascript
import React from "react";
import Button from "@mui/material/Button";

export default function ButtonUsage() {
  return (
    <div>
      <Button variant="contained" color="primary">
        Primary Button
      </Button>
      <Button variant="outlined" color="secondary">
        Secondary Button
      </Button>
    </div>
  );
}
```

Kısa açıklama:

- `variant="contained"` tam dolgulu bir buton verir (vurgulu eylemler için uygundur).
- `variant="outlined"` kenarlıklı, arkaplanı transparan bir buton verir (ikincil eylemler için uygundur).
- `color="primary"` ve `color="secondary"` temaya bağlı renk setlerinden otomatik olarak yararlanır.

Kullanım notları:

- Projede `ThemeProvider` ile özel renk paleti tanımlanmışsa butonlar ona göre şekillenir.
- Eğer butonlar gözükmüyorsa konsolda `Module not found` veya benzeri import hatası olup olmadığını kontrol edin (MUI paketleri yüklü mü?).

### MainLayout.jsx (detaylı)

`src/layouts/MainLayout.jsx` uygulamanın temel layout'udur. İçinde uygulama başlığı, örnek butonlar (ButtonUsage) ve nested route'ların render edilmesi için `Outlet` bulunur.

Mevcut dosyada küçük bir import hatası var: `Outlet` şu anda `react-router`'dan import ediliyor. Doğru olan `react-router-dom`'dan import etmektir. Aşağıda mevcut ve düzeltilmiş örnek gösterilmiştir.

Mevcut (düzeltme öncesi):

```javascript
import React from "react";
import { Outlet } from "react-router";
import ButtonUsage from "../components/ButtonUsage";

export default function MainLayout() {
  return (
    <div>
      <h1>MainLayout</h1>
      <p>Welcome to the Store App!</p>
      <ButtonUsage />
      <Outlet />
    </div>
  );
}
```

Düzeltilmiş (önerilen) versiyon:

```javascript
import React from "react";
import { Outlet } from "react-router-dom";
import ButtonUsage from "../components/ButtonUsage";

export default function MainLayout() {
  return (
    <div>
      <h1>MainLayout</h1>
      <p>Welcome to the Store App!</p>
      <ButtonUsage />
      <Outlet />
    </div>
  );
}
```

Neden değiştirmeli?

- `react-router-dom` React tarayıcı uygulamaları için gerekli DOM bindings'i içerir; örnekler ve belgelendirme `react-router-dom` üzerine kuruludur. `Outlet`'i buradan import etmek hem daha doğru hem de daha taşınabilir bir kullanım sağlar.

Ek öneriler:

- `ButtonUsage` yerine gerçek Navbar veya AppBar bileşeni kullanmak isterseniz MUI'nin `AppBar`, `Toolbar`, `IconButton` gibi bileşenlerini kullanarak daha zengin bir header oluşturabilirsiniz.
- Layout'a `CssBaseline` veya tipografi ayarları eklemek için `ThemeProvider` ile sarmalayın.

5. Hızlı doğrulama

- Paketleri yükledikten sonra geliştirme sunucusunu çalıştırın:

  npm run dev

- Tarayıcıyı açın ve ana sayfada MUI butonlarını görün. Konsolda herhangi bir import/resolve hatası görürseniz paketlerin doğru yüklendiğinden emin olun.

6. İleri adımlar (isteğe bağlı)

- `@mui/icons-material` paketini kullanarak icon'lar ekleyin: `import Icon from '@mui/icons-material/SomeIcon'`.
- Tema özelleştirmesi, responsive tipografi, ve component-level sx stil parametresi ile UI'yi proje ihtiyaçlarına göre şekillendirin.

7. Notlar

- Windows üzerinde dosya isimlendirmesi esnek olsa da import yollarında `react-router-dom` gibi resmi isimlere uyun.
- Eğer proje daha sonra SSR, test veya paket optimizasyonu gerektirirse MUI ile ilgili ek yapılandırmalar (emotion cache vs) gerekebilir.

İsterseniz ben paketleri yükleyip `MainLayout.jsx` içindeki `Outlet` importunu düzeltebilirim ve `ProductsDetails.jsx`'e `useParams` ile örnek bir render ekleyebilirim. Hangi adımı tercih edersiniz?
