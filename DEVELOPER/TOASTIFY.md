react-toastify kullanım notları

Bu dosya, projede `react-toastify` kütüphanesini nasıl kullanacağınızı kısa ve öz anlatır.

1. Kurulum

Projeye kütüphaneyi eklemek için:

```bash
npm install react-toastify
```

2. CSS importu (zorunlu)

Toastr stillerinin yüklenmesi için uygulamanın giriş noktasında (ör. `src/layouts/Main.jsx`) aşağıdaki import bulunmalıdır:

```js
import "react-toastify/dist/ReactToastify.css";
```

3. `ToastContainer` yerleştirme

Genellikle uygulama düzeyinde (layout veya App) bir kez `ToastContainer` eklenir. Örnek `Main.jsx` içinde zaten şöyle kullanılıyor:

```jsx
<ToastContainer position="bottom-right" theme="colored" />
```

`ToastContainer` props ile konum (`position`), otomatik kapanma süresi (`autoClose`), progress bar gösterimi vb. ayarlanabilir.

4. Toast göstermek

Herhangi bir komponent içinde toast göstermek için `toast` fonksiyonunu import edip çağırmanız yeterlidir:

```js
import { toast } from "react-toastify";

// Başarılı işlem
toast.success("İşlem başarılı");

// Hata
toast.error("Bir hata oluştu");

// Bilgi
toast.info("Bilgilendirme mesajı");
```

5. Örnek kullanım (async işlem)

```js
async function handleSave() {
  try {
    await api.save(data);
    toast.success("Kaydedildi");
  } catch (err) {
    toast.error("Kaydetme sırasında hata");
  }
}
```

6. İleri konfigürasyon

- `ToastContainer` içine global ayar verilebilir: `autoClose`, `hideProgressBar`, `pauseOnHover`, `closeOnClick`, vb.
- İsterseniz farklı containerları farklı sayfalarda kullanabilirsiniz.

7. Notlar

- `ToastContainer` sadece 1 kez koyulmalıdır; birden fazlası kafa karışıklığına sebep olur.
- Vite çalışırken yeni paket yükledikten sonra dev server otomatik olarak güncellenir; güncelleme görülmezse `npm run dev` ile yeniden başlatın.

Bu dosyayı hızlı referans olarak tutabilirsiniz.
