<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;margin-bottom:12px">
	<a href="https://nextjs.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Next.js-13.x-black?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js"/></a>
	<a href="https://reactjs.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/></a>
	<a href="https://www.sqlite.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/SQLite-Local-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite"/></a>
	<a href="https://nodejs.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/></a>
	<a href="https://github.com/1DeliDolu/store-app-react" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/github/stars/1DeliDolu/store-app-react?style=social" alt="GitHub stars"/></a>
</div>

# Blog App (Next.js) — Türkçe

Bu depo, Next.js (App Router) kullanılarak hazırlanmış örnek bir blog uygulamasıdır. Projede küçük bir SQLite veritabanı (`blog.db`) ve bazı yardımcı betikler (`scripts/seed-db.js`, `scripts/check-db.js`) bulunmaktadır. Aşağıda proje hakkında hızlı ve pratik bilgiler yer almaktadır.

## Öne çıkanlar

- Next.js App Router düzeni (server ve client bileşen karışımı)
- Yerel geliştirme için hızlı kurulum sağlayan SQLite veri deposu
- Örnek sayfalar: blog listesi, tekil blog sayfası, kullanıcı sayfaları, basit oturum (login/register) iskeleti

## Teknolojiler

- Next.js (App Router)
- React
- SQLite (yerel `blog.db` dosyası)
- Node.js (npm)

## Gereksinimler

- Node.js LTS (18 veya üzeri önerilir)
- npm veya uyumlu bir paket yöneticisi

## Hızlı başlangıç

1. Depoyu klonlayın veya indirin.
2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. (İsteğe bağlı) Örnek verileri veritabanına ekleyin:

```bash
node scripts/seed-db.js
```

4. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

Not: Veritabanı bağlantı/konfigürasyonu `connect.js` dosyasında bulunur. Farklı bir veritabanı veya ortam değişkenleri kullanacaksanız, bu dosyayı düzenleyin.

## Mevcut script'ler

- `npm run dev` — Geliştirme sunucusunu başlatır
- `npm run build` — Üretim için derleme (Next.js)
- `npm run start` — Üretim sunucusunu çalıştırma (önce `build` çalıştırılmalıdır)
- `node scripts/seed-db.js` — Örnek verileri veritabanına ekler
- `node scripts/check-db.js` — Veritabanı ve bağlantı kontrolü yapar

(Eğer `package.json` içinde farklı script isimleri varsa, kendi proje ayarınıza göre komutları kullanın.)

## Proje yapısı (özet)

- `app/` — Next.js App Router kaynakları (sayfalar, layout, api)
- `components/` — Yeniden kullanılabilir React bileşenleri
- `public/` — Statik dosyalar (resimler, ikonlar)
- `scripts/` — Yardımcı betikler (seed-db, check-db vb.)
- `blog.db` — Yerel SQLite veritabanı dosyası
- `connect.js` — Veritabanı bağlantı yardımcı dosyası

## Deployment (yayına alma)

Bu proje Vercel ile uyumludur. Yayına almak için:

1. Depoyu Vercel'e bağlayın.
2. Build komutu: `npm run build`, Start komutu: `npm run start`.

Ayrıca Docker veya Next.js destekleyen herhangi bir hosting sağlayıcısında da dağıtabilirsiniz.

## Katkıda bulunma

Küçük düzeltmeler, dokümantasyon iyileştirmeleri ve hata düzeltmeleri için pull request gönderebilirsiniz. Daha büyük değişiklikler için önce bir issue açıp tartışmanız önerilir.

## İpuçları ve sık karşılaşılan durumlar

- Sayfalar güncellenmiyorsa geliştirme sunucusunu yeniden başlatın: `npm run dev`.
- Örnek veritabanını sıfırlamak için `blog.db` dosyasını silip `node scripts/seed-db.js` çalıştırın.
- Bağlantı problemleri için `node scripts/check-db.js` ile kontrol edin.

## Lisans

Projede bir `LICENSE` dosyası yoksa uygun bir lisans (ör. MIT) eklemeniz önerilir.

---

## Eğer bu README'e eklememi istediğiniz başka bir bölüm (API dökümü, environment değişkenleri listesi, örnek payloadlar, test komutları vb.) varsa belirtin; hemen Türkçe olarak ekleyeyim.

Below is the Turkish version of the README.

# Blog App (Next.js)

Modern, sade ve yerel olarak çalıştırılabilir bir Next.js blog uygulaması.

Bu depo Next.js (App Router) kullanılarak oluşturulmuş örnek bir blog uygulamasıdır. Basit bir SQLite veritabanı (`blog.db`) ile birlikte gelir ve proje kökünde bazı yardımcı betikler (`scripts/seed-db.js`, `scripts/check-db.js`) bulunur.

## Öne çıkanlar

- Next.js App Router yapısı (server/client component karışımı)
- Basit SQLite veri kaynağı (yerel geliştirme için hızlı kurulum)
- Hazır sayfalar: blog listesi, tekil blog, kullanıcı sayfaları, oturum (login/register) iskeleti

## Teknolojiler

- Next.js (App Router)
- React
- SQLite (projekte `blog.db` dosyası)
- Node.js (npm)

## Gereksinimler

- Node.js LTS (18+ önerilir)
- npm ya da uyumlu bir paket yöneticisi

## Hızlı başlangıç

1. Depoyu klonlayın veya indirin.
2. Bağımlılıkları kurun:

```bash
npm install
```

3. Veritabanını seed (örnek veri) ile doldurun (isteğe bağlı):

```bash
node scripts/seed-db.js
```

4. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

Not: Projeye özgü veritabanı bağlantısı `connect.js` dosyasında yapılandırılmıştır. Eğer farklı bir veritabanı ya da ortam değişkeni gerekiyorsa burada değişiklik yapabilirsiniz.

## Mevcut script'ler

- `npm run dev` — Geliştirme sunucusunu başlatır
- `npm run build` — Üretim için derleme (Next.js)
- `npm run start` — Üretim sunucusunu çalıştırma (önce `build` çalıştırılmalıdır)
- `node scripts/seed-db.js` — Örnek verileri veritabanına ekler
- `node scripts/check-db.js` — Veritabanı ve bağlantı kontrolü

(Projede kullanılan `package.json` içindeki script isimleri farklıysa, kendi proje yapılandırmanıza göre çalıştırın.)

## Proje yapısı (özet)

- `app/` — Next.js App Router kaynakları (sayfalar, layout, api)
- `components/` — Yeniden kullanılabilir React bileşenleri
- `public/` — Statik dosyalar (resimler, ikonlar)
- `scripts/` — Yardımcı betikler (seed, check-db)
- `blog.db` — Yerel SQLite veritabanı dosyası
- `connect.js` — Veritabanı bağlantı yardımcı dosyası

## Deployment

Bu proje Vercel ile uyumludur. Üretime almak için:

1. Repo'yu Vercel'e bağlayın.
2. Build komutu: `npm run build`, Çalıştırma komutu: `npm run start`.

Alternatif olarak Docker veya başka bir hosting sağlayıcısında da Next.js uygulaması olarak dağıtılabilir.

## Katkıda bulunma

Küçük değişiklikler, hata düzeltmeleri ve dokümantasyon iyileştirmeleri için PR gönderebilirsiniz. Büyük değişiklikler için önce bir issue açıp tartışmanız faydalı olur.

## İpuçları ve sık karşılaşılan durumlar

- Eğer sayfalar güncellenmiyorsa: geliştirme sunucusunu yeniden başlatın (`npm run dev`).
- `blog.db` dosyasını silip `scripts/seed-db.js` çalıştırarak temiz bir başlangıç yapabilirsiniz.

## Lisans

Bu projenin lisansı root klasördeki `LICENSE` dosyasında yoksa, lütfen uygun bir lisans ekleyin (ör. MIT).

---

If you want any additional content added to the English README (API reference, environment variables, example payloads, tests), tell me which parts and I'll add them.
