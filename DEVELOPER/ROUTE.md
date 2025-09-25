## Routing

Bu proje React Router (v6+) kullanılarak yapılandırılmıştır. Aşağıda `src/App.jsx`, `src/layouts/MainLayout.jsx`, `src/pages/ProductsPage.jsx` ve `src/pages/products/ProductsDetails.jsx` dosyalarında tanımlanan routing mantığı ve önemli detaylar özetlenmiştir.

- Root (kök) router `createBrowserRouter` ile `src/App.jsx` içinde oluşturulur. Root element olarak `MainLayout` kullanılır ve child (alt) rotalar `children` dizisinde tanımlanır.
- Route ağacı (özet):
  - `/` -> `HomePage` (index)
  - `/home` -> `HomePage`
  - `/products` -> `ProductsPage` (index)
  - `/products/:id` -> `ProductsDetails` (dinamik)
  - `/cart` -> `CartPage`
  - `/login` -> `LoginPage`
  - `/register` -> `RegisterPage`

Önemli noktalar

- Nested routes: `/products` parent route olarak tanımlanmış ve child route olarak `:id` (yani `products/:id`) kullanılmıştır. Parent route altındaki child tanımında child path sadece `:id` şeklinde olmalıdır. Bu sayede `/products/1` gibi URL'ler doğru şekilde eşleşir.
- `Outlet` kullanımı: `MainLayout` ve `ProductsPage` bileşenlerinde `Outlet` bulunmaktadır. `Outlet`, child route bileşenlerinin parent layout içinde render edilmesini sağlar. `Outlet`'i kullanmayı unutursanız child rotalar görünmez.
- Göreli Link'ler: `ProductsPage` içinden ürün detayına yönlendirirken göreli link kullanın, örn. `<Link to={`${product.id}`}>` — bu, parent `/products` path'ine göreli navigasyon sağlar.

Dinamik paramlar ve veri alma

- `ProductsDetails.jsx` içinde route paramını almak için `useParams` kullanılabilir:

  const { id } = useParams();

  Bu `id` ile API çağrısı yapıp ürün verisini çekebilir ve gösterim yapabilirsiniz.

- Daha sağlam bir yaklaşım için router'ın `loader` özelliğini kullanın. `loader`, route'a girilmeden önce veriyi yüklemenize ve hataları router seviyesinde yönetmenize imkan verir. Örnek (kısaca):

  {
  path: ":id",
  element: <ProductsDetailsPage />,
  loader: async ({ params }) => {
  const res = await fetch(`/api/products/${params.id}`)
  if (!res.ok) throw new Response("Not Found", { status: 404 })
  return res.json()
  }
  }

  Ve detay bileşeninde `useLoaderData()` ile veriyi alın.

Hata yönetimi

- Router köküne bir `errorElement` ekleyerek 404 / loader hatalarını kullanıcıya güzel bir sayfa ile gösterebilirsiniz. Loader içinde hata fırlatıldığında bu component render edilir.

Performans ve UX

- Loader kullanırken yüklenme durumları için basit bir loading UI veya Suspense kullanın.

Pratik öneriler

- `MainLayout.jsx` dosyasındaki `Outlet` importunu `react-router-dom`'dan yapın: `import { Outlet } from 'react-router-dom'` (küçük ama kritik).
- Dosya isimleri ve component isimleri tutarlı olsun: `ProductsDetails.jsx` component adıyla dosya adı birbirine uyumlu olsun. Windows dosya sistemi case-insensitive olsa da tutarlılık önemlidir.

Nasıl test edilir

- Geliştirme sunucusunu başlatın:

  npm run dev

- Tarayıcıda şu URL'leri kontrol edin:
  - http://localhost:3000/products → `ProductsPage` görünmeli
  - http://localhost:3000/products/1 → `ProductsDetails` (veya loader ile dönen veri) görünmeli

Eğer isterseiz, ben `ProductsDetails.jsx` içine `useParams` ile id gösteren basit bir örnek veya loader tabanlı fetch implementasyonu ekleyebilirim.
