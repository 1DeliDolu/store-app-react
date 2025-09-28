Bu dosya `src/pages/catalog/catalogSlice.js`, `src/pages/Products.jsx`, `src/pages/ProductDetails.jsx` ve uygulama `store`'undaki katalog ile ilgili bağlantıları ayrıntılı olarak açıklar. Amaç: kodun ne yaptığını, hangi veri akışlarının bulunduğunu, performans/önbellekleme davranışlarını ve sık karşılaşılan hata durumlarını açıklamak.

1. catalogSlice.js — ne yapar ve neden önemli?

- Kısaca: Ürün kataloğunu yönetmek için bir Redux Toolkit slice'ı. `createEntityAdapter` ile entity tabanlı bir yapı kurar; bu, ürünleri normalize edip, CRUD benzeri operasyonları kolaylaştırır.

- Önemli parçalar:

  - `fetchProducts` (createAsyncThunk): sunucudan ürün listesini çeker (`requests.products.list()`), başarılı olunca payload olarak ürün dizisini döner.
  - `fetchProductById` (createAsyncThunk): tek bir ürünün detayını çeker (`requests.products.details(productId)`) ve döner.
  - `productsAdapter = createEntityAdapter()` : entity adapter, state içinde normalized bir yapı (ids, entities) sağlar ve performanslı seçiciler üretir.
  - `initialState = productsAdapter.getInitialState({ status: 'idle', isLoaded: false })` : başlangıçta durum ve isLoaded bayrağı tanımlanır.
  - `extraReducers` içinde:
    - `fetchProducts.pending` → `status = 'pendingFetchProducts'`
    - `fetchProducts.fulfilled` → adapter ile tüm ürünler state'e set edilir, `isLoaded = true`, `status = 'idle'`
    - `fetchProductById.pending` → `status = 'pendingFetchProductById'`
    - `fetchProductById.fulfilled` → adapter.upsertOne ile tek ürün eklenir/güncellenir, `status = 'idle'`

- Neden entity adapter?
  - Büyük ürün listeleri ile çalışırken yeniden render'ları azaltır.
  - Tekil ürün güncelleme (upsertOne) basit ve hızlıdır.
  - `getSelectors((state) => state.catalog)` ile `selectById`, `selectAll` gibi seçiciler otomatik elde edilir.

2. Products.jsx — nasıl kullanır?

- Kısaca: Ürün listesini gösteren sayfa. Redux'tan ürünleri ve yükleme durumunu alır; eğer katalog daha önce yüklenmemişse (`isLoaded` false) `fetchProducts()` thunk'ını dispatch eder.

- Önemli davranış:

  - `useEffect` içinde `if (!isLoaded) dispatch(fetchProducts())` : buna bağlı olarak sayfa ilk açıldığında katalog yüklenir, tekrar yüklemeler önlenir.
  - `status === 'pendingFetchProducts'` ise `Loading` bileşeni gösterilir.
  - `selectAllProducts` seçici aracılığıyla normalize edilmiş ürünlerden bir dizi elde edilir ve `ProductList`'e verilir.

- Tavsiye:
  - Eğer sayfa filtresi veya arama destekleyecekse, cache anahtarını veya parametreyi thunk'a geçirip `isLoaded` kontrolünü buna göre genişletin (örn. kategori bazlı önbellekleme).

3. ProductDetails.jsx — tekil ürün akışı

- Kısaca: Ürün detay sayfası; katalog adapter'ından ürünü `selectProductById` ile alır, yoksa `fetchProductById(id)` ile sunucudan çeker.

- Önemli davranış:

  - `const product = useSelector((state) => selectProductById(state, id))` : önce store içinden arar (cache hit).
  - Eğer `product` yoksa `useEffect` içinde `dispatch(fetchProductById(id))` çağrılır (cache miss durumunda sunucudan çekme).
  - `isAdding`/`status` kontrolü yerine burada `status === 'pendingAddItem' + product.id` ile sepete ekleme yüklemesi gösteriliyor — yani `cart` slice tarafından yönetilen per-item status pattern'ı kullanılıyor.

- Neden bu pattern iyi?
  - Tekil ürün ayrıntısı zaten store'da varsa HTTP isteği atılmaz — ağ maliyeti azalır.
  - `fetchProductById` fulfilled olduğunda adapter.upsertOne ile ürün eklenir ve daha sonra diğer bileşenler aynı veriyi kullanır.

4. store yapılandırması (excerpt)

- `store = configureStore({ reducer: { counter: counterSlice.reducer, cart: cartSlice.reducer, catalog: catalogSlice.reducer } })`

- Bu, `catalogSlice.reducer`'ın `state.catalog` alanına bağlandığını gösterir. Bu sayede `productsAdapter.getSelectors((state) => state.catalog)` doğru state kökünü kullanır.

5. Hata senaryoları ve dikkat edilmesi gerekenler

- Duplicate fetch: `Products.jsx`'de `isLoaded` kontrolü iyi, ancak eğer farklı filtre/parametreler varsa `isLoaded` tek bir boolean yeterli olmaz; parametre bazlı cache (ör. `loadedByCategory: { [categoryId]: true }`) gerekebilir.
- Stale data: Ürün detayları güncellenebiliyorsa `fetchProductById` veya arka plan yenileme mekanizması (revalidate) ekleyin.
- Race koşulları: Aynı anda iki farklı `fetchProductById` çağrısı gelirse adapter'e yapılan upsert işlemleri son gelen veriyi kullanır; genelde sorun olmaz ama optimistic update senaryolarında dikkat gerekir.

6. İyileştirme önerileri

- Parametre bazlı önbellekleme: kategori, arama, sıralama gibi durumları thunk argümanlarıyla birlikte cache anahtarları olarak yönetin.
- TTL veya background refresh: ürünler sık değişiyorsa (fiyat, stok) arka planda periyodik yenileme ekleyin.
- Error handling: `rejected` branch'inde kullanıcıya gösterebileceğiniz `error` bilgisi saklanabilir (örn. `state.error = action.error.message`).

7. Hızlı kontrol listesi (deploy öncesi)

- [ ] `fetchProducts` başarılı olduğunda `isLoaded` true oluyor mu?
- [ ] `selectProductById` cache hit sağlıyor mu — ProductDetails ilk açılışta gereksiz HTTP isteği atıyor mu?
- [ ] `status` değerleri UI ile birebir uyuşuyor mu (pending string'leri doğru oluşturuluyor mu?)
- [ ] Farklı filtre/parametre senaryolarında tekrar yüklenme/önbellek davranışı uygun mu?

Sonuç: Bu yapı katalog verilerini performanslı ve ölçeklenebilir şekilde yönetir; temel öneri, parametre/filtre bazlı önbellekleme ve daha iyi hata bilgisi saklamak olacaktır.
