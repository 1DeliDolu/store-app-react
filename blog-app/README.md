<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;margin-bottom:12px">
	<a href="https://nextjs.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Next.js-13.x-black?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js"/></a>
	<a href="https://reactjs.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/></a>
	<a href="https://www.sqlite.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/SQLite-Local-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite"/></a>
	<a href="https://nodejs.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/></a>
	<a href="https://github.com/1DeliDolu/store-app-react" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/github/stars/1DeliDolu/store-app-react?style=social" alt="GitHub stars"/></a>
</div>

# Blog App (Next.js) — English

Modern, simple, and locally runnable Next.js blog application.

This repository is an example blog built with Next.js (App Router). It includes a small SQLite database (`blog.db`) and helper scripts in `scripts/` (e.g. `seed-db.js`, `check-db.js`).

## Highlights

- Next.js App Router structure (server/client components)
- Simple SQLite data store (fast local setup)
- Example pages: blog list, single blog, user pages, basic auth skeleton (login/register)

## Tech stack

- Next.js (App Router)
- React
- SQLite (local `blog.db` file)
- Node.js (npm)

## Requirements

- Node.js LTS (18+ recommended)
- npm or a compatible package manager

## Quick start

1. Clone or download the repo.
2. Install dependencies:

```bash
npm install
```

3. (Optional) Seed the database with sample data:

```bash
node scripts/seed-db.js
```

4. Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Note: Database connection logic lives in `connect.js`. If you need a different database or environment configuration, edit that file.

## Available scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production (Next.js)
- `npm run start` — Start production server (run after `build`)
- `node scripts/seed-db.js` — Insert sample data into the database
- `node scripts/check-db.js` — Check database and connection

(If your `package.json` uses different script names, use those instead.)

## Project structure (overview)

- `app/` — Next.js App Router sources (pages, layouts, api)
- `components/` — Reusable React components
- `public/` — Static assets (images, icons)
- `scripts/` — Utility scripts (seed, check-db)
- `blog.db` — Local SQLite database file
- `connect.js` — Database connection helper

## Deployment

This project works well with Vercel. To deploy:

1. Connect the repo to Vercel.
2. Build command: `npm run build`, Start command: `npm run start`.

You can also deploy with Docker or any hosting provider that supports Next.js.

## Contributing

Send pull requests for small fixes, documentation updates, and improvements. For larger changes, open an issue first to discuss.

## Tips & common issues

- If pages don't update, restart the dev server (`npm run dev`).
- Remove `blog.db` and re-run `node scripts/seed-db.js` to reset sample data.

## License

If there's no `LICENSE` file in the repo root, add an appropriate license (for example MIT).

---

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
