# Dağıtım (Deploying)

Next.js, bir **Node.js sunucusu**, **Docker konteyneri**, **statik export**, veya farklı platformlara uyarlanarak dağıtılabilir.

| Dağıtım Seçeneği | Özellik Desteği |
| ---------------- | --------------- |
| Node.js server   | Tümü            |
| Docker container | Tümü            |
| Static export    | Sınırlı         |
| Adapters         | Platforma özel  |

---

## Node.js Sunucusu

Next.js, **Node.js** destekleyen herhangi bir sağlayıcıya dağıtılabilir.
`package.json` dosyanızda `"build"` ve `"start"` script’lerinin olduğundan emin olun:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Ardından şu komutları çalıştırın:

* `npm run build` → uygulamanızı derler
* `npm run start` → Node.js sunucusunu başlatır

Bu sunucu, **tüm Next.js özelliklerini** destekler. Gerekirse özel bir sunucuya da geçiş yapabilirsiniz.

🔗 Daha fazla bilgi: Node.js dağıtımlarını kendi altyapınıza göre yapılandırma.

**Hazır şablonlar:**

* Flightcontrol
* Railway
* Replit

---

## Docker

Next.js, Docker konteynerlerini destekleyen herhangi bir sağlayıcıya dağıtılabilir.
Buna Kubernetes gibi konteyner orkestratörleri veya Docker çalıştıran bulut sağlayıcıları da dahildir.

**Docker dağıtımları tüm Next.js özelliklerini destekler.**

⚠️ Geliştirme için not: Docker prodüksiyon dağıtımları için harikadır, ancak Mac ve Windows üzerinde geliştirme sırasında daha iyi performans için Docker yerine **yerel geliştirme (`npm run dev`)** kullanmayı düşünün.

🔗 Daha fazla bilgi: Yerel geliştirmeyi optimize etme.

**Hazır şablonlar:**

* Docker
* Docker Multi-Environment
* DigitalOcean
* Fly.io
* Google Cloud Run
* Render
* SST

---

## Static Export

Next.js, başlangıçta bir **statik site** veya **SPA (Single-Page Application)** olarak çalıştırılabilir. Daha sonra, sunucu gerektiren özelliklere ihtiyaç duyduğunuzda yükseltme yapabilirsiniz.

Statik export sayesinde HTML/CSS/JS dosyalarını sunabilen herhangi bir web sunucusunda barındırılabilir.
Buna **AWS S3**, **Nginx** veya **Apache** gibi araçlar dahildir.

⚠️ Not: Statik export, sunucu gerektiren Next.js özelliklerini **desteklemez**.

**Hazır şablonlar:**

* GitHub Pages

---

## Adapters

Next.js, farklı platformların altyapı yeteneklerini destekleyecek şekilde uyarlanabilir.
Her sağlayıcının belgelerine bakarak desteklenen Next.js özelliklerini öğrenebilirsiniz:

* AWS Amplify Hosting
* Cloudflare
* Deno Deploy
* Netlify
* Vercel

ℹ️ Not: Tüm platformların benimseyebileceği bir **Deployment Adapters API** üzerinde çalışıyoruz. Tamamlandığında, kendi adapterlerinizi nasıl yazabileceğinize dair belgeler eklenecek.
