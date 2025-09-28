<!-- navigation bottom -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="4_Setup and Teardown.md">← Önceki</a>
  <span></span>
  <a href="6_Jest_Platform.md">Sonraki →</a>
</div>

# Jest Mock Fonksiyonları — Hızlı Rehber

Mock fonksiyonlar (spy / test double) gerçek uygulamayı geçici olarak iptal eder, çağrı kayıtlarını tutar, dönüş değerlerini test zamanında kontrol etmenizi sağlar ve nesne örneklemelerini (new ile oluşturulanları) yakalar. Bu sayede dış bağımlılıkları izole edip hızlı, kararlı testler yazabilirsiniz.

## 1) Basit mock fonksiyon: `jest.fn()`

`jest.fn()` ile bir mock fonksiyon oluşturabilirsiniz. Mock'un `.mock` özelliği çağrı bilgilerini, dönüş değerlerini ve bağlam (this) verilerini tutar.

Örnek: `forEach` fonksiyonunu test etme

```js
// forEach.js
export function forEach(items, callback) {
  for (const item of items) {
    callback(item);
  }
}

// forEach.test.js
import { forEach } from './forEach';

const mockCallback = jest.fn(x => 42 + x);

test('forEach calls callback for each element', () => {
  forEach([0, 1], mockCallback);

  // iki kez çağrıldı
  expect(mockCallback.mock.calls).toHaveLength(2);

  // ilk çağrının ilk argümanı 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // ikinci çağrının ilk argümanı 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // birinci çağrının dönüş değeri
  expect(mockCallback.mock.results[0].value).toBe(42);
});
```

`mock` içindeki faydalı alanlar:
- `mock.calls` — çağrı argümanlarını içerir (array of arrays)
- `mock.results` — çağrı dönüş bilgilerini içerir
- `mock.instances` — fonksiyon `new` ile çağrıldıysa oluşturulan örnekleri içerir
- `mock.contexts` — çağrı esnasındaki `this` bağlamlarını içerir
- `mock.lastCall` — son çağrının argümanları

## 2) Mock dönüş değerleri ve davranışlar

Mock fonksiyonlara dönüş değeri veya birden fazla dönüş davranışı tanımlayabilirsiniz:

```js
const myMock = jest.fn();
myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// -> 10, 'x', true, true
```

`mockImplementation` / `mockImplementationOnce` ile karmaşık davranışlar tanımlanabilir:

```js
const myMockFn = jest
  .fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val)); // true
myMockFn((err, val) => console.log(val)); // false
```

Eğer mockImplementationOnce ile tanımlananlar tükenirse, varsayılan `jest.fn()` implementasyonu çağrılır (varsa).

### mockReturnThis()

Zincirlenmiş API'ler için `mockReturnThis()` yardımcıdır — `this` döndürür:

```js
const myObj = { myMethod: jest.fn().mockReturnThis() };
```

### mockName()

Hatalarda hangi mock'un raporlandığını kolayca görmek için mock'a isim verebilirsiniz:

```js
const myMock = jest.fn().mockName('add42');
```

## 3) Modül seviyesinde mocklama (`jest.mock`)

Gerçek ağ çağrılarını veya ağır işlemleri testte çalıştırmak istemezsiniz. `jest.mock('module')` ile bir modülü otomatik olarak mock'layabilir ve içindeki fonksiyonların davranışını test içinde tanımlayabilirsiniz.

Örnek: `axios`'u mocklamak

```js
// users.js
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;

// users.test.js
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('fetches users', () => {
  const users = [{ name: 'Bob' }];
  const resp = { data: users };
  axios.get.mockResolvedValue(resp);

  return Users.all().then(data => expect(data).toEqual(users));
});
```

`mockResolvedValue` ve `mockRejectedValue` Promise döndüren mocklar için kullanışlıdır.

## 4) Kısmi (partial) mocklama

Bir modülün sadece bazı ihracatlarını mock'layıp geri kalanını gerçek bırakabilirsiniz:

```js
// foo-bar-baz.js
export const foo = 'foo';
export const bar = () => 'bar';
export default () => 'baz';

// test.js
import defaultExport, { bar, foo } from '../foo-bar-baz';

jest.mock('../foo-bar-baz', () => {
  const originalModule = jest.requireActual('../foo-bar-baz');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    foo: 'mocked foo',
  };
});

test('partial mock', () => {
  expect(defaultExport()).toBe('mocked baz');
  expect(foo).toBe('mocked foo');
  expect(bar()).toBe('bar');
});
```

## 5) Mock implementasyonunu değiştirme

`jest.mock` ile otomatik mocklama yapıldıktan sonra `mockImplementation` veya `mockImplementationOnce` ile davranışı özelleştirebilirsiniz.

```js
jest.mock('../foo');
const foo = require('../foo');
foo.mockImplementation(() => 42);
expect(foo()).toBe(42);
```

## 6) Ek yardımcılar ve matcher'lar

Jest, mock'lar için birkaç kullanışlı matcher sağlar:

- `toHaveBeenCalled()` — en az bir kez çağrıldığını doğrular
- `toHaveBeenCalledWith(...args)` — belirtilen argümanlarla çağrıldığını doğrular
- `toHaveBeenLastCalledWith(...args)` — son çağrı argümanlarını doğrular
- `toMatchSnapshot()` — tüm çağrıları snapshot olarak saklar

Örnekler:

```js
expect(mockFunc).toHaveBeenCalled();
expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);
expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);
```

Alternatif olarak `.mock` içeriğini manuel inceleyebilirsiniz:

```js
expect(mockFunc.mock.calls.length).toBeGreaterThan(0);
expect(mockFunc.mock.calls).toContainEqual([arg1, arg2]);
```

## 7) İyi uygulamalar

- Testlerinizde gerçek ağ çağrılarını kullanmaktan kaçının; mock'lar testleri hızlı ve kararlı kılar.
- Mümkün olduğunca küçük birim testleri yazın — mock kullanarak dış bağımlılıkları izole edin.
- Mock içindeki karmaşık mantığı test etmeyin; bunun yerine mock'u konfigure edin ve fonksiyonun size verdiği çıktıları test edin.
- Test dosyalarınızda `jest.clearAllMocks()` veya `jest.resetAllMocks()` ile global mock durumunu temizlemeyi düşünün. `setupFilesAfterEnv` içinde bunu otomatikleştirebilirsiniz.



Bu rehberi isterseniz `axios` mocking örnekleri, `fetch` için global mock veya `test double` stratejileri ile genişletebilirim.


<!-- navigation bottom -->
<div class="md-nav" style="display:flex;gap:1rem;justify-content:space-between">
  <a href="4_Setup and Teardown.md">← Önceki</a>
  <span></span>
  <a href="6_Jest_Platform.md">Sonraki →</a>
</div>