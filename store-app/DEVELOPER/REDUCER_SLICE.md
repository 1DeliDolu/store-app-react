# `counterSlice.js` ve `store.js` — Detaylı Açıklama

Bu doküman `src/pages/counter/counterSlice.js` ve `src/store/store.js` dosyalarının ne yaptığını, satır satır nasıl çalıştığını, React bileşenlerinde nasıl kullanılacağını, test ve dikkat edilmesi gereken noktaları modern bir Markdown formatında açıklar.

## İçerik

- Dosya özetleri
- `counterSlice.js` satır satır açıklama
- `store.js` satır satır açıklama
- Bileşen örneği: hook'larla kullanım
- Test, hata durumları ve iyi uygulamalar

---

## Dosya özetleri

- `src/pages/counter/counterSlice.js`

  - Redux Toolkit'in `createSlice` API'sini kullanarak bir `counter` slice tanımlar.
  - `initialState`, reducer'lar (`increment`, `decrement`, `incrementByAmount`) ve action creator'lar burada oluşturulur.

- `src/store/store.js`
  - `configureStore` ile uygulamanın Redux store'unu kurar ve `counter` reducer'ını store'a bağlar.

---

## `counterSlice.js` — satır satır açıklama

Dosya içeriği (kısaltılmış):

```javascript
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
```

Açıklama:

- `import { createSlice } from '@reduxjs/toolkit';`

  - Redux Toolkit'in `createSlice` yardımcı fonksiyonunu getirir. Bu fonksiyon action type'ları, action creator'ları ve reducer'ı tek bir yerde tanımlamayı kolaylaştırır.

- `const initialState = { value: 0 };`

  - Slice'ın başlangıç (default) state'ini tanımlar. Bu örnekte sayaç değeri `value` içinde tutulur.

- `export const counterSlice = createSlice({ ... })`
  - `name`: slice'ın adı. Action type'ları otomatik olarak `counter/increment` gibi isimlendirilir.
  - `initialState`: başlangıç state.
  - `reducers`: state değişikliklerini tanımlayan fonksiyonlar. Burada üç reducer var:
    - `increment`: state.value'yu 1 arttırır.
    - `decrement`: state.value'yu 1 azaltır.
    - `incrementByAmount`: `action.payload` kadar arttırır.

Not: Reducer fonksiyonları doğrudan `state` üzerinde değişiklik yapıyormuş gibi yazılmıştır. Toolkit altında bu kodlar immer kullanılarak güvenli immutable güncellemelere dönüştürülür.

- `export const { increment, decrement, incrementByAmount } = counterSlice.actions;`

  - `createSlice` tarafından otomatik oluşturulan action creator'ları dışa aktarır. Bileşenlerde `dispatch(increment())` gibi kullanılır.

- `export default counterSlice.reducer;`
  - Slice'ın reducer'ını default export eder; bu reducer `configureStore` içinde kullanılacaktır.

---

## `store.js` — satır satır açıklama

Dosya içeriği:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../pages/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
```

Açıklama:

- `import { configureStore } from "@reduxjs/toolkit";`

  - Redux Toolkit'in tavsiye edilen store oluşturma fonksiyonudur. Varsayılan olarak iyi middleware (ör. thunk) ve Redux DevTools entegrasyonu sağlar.

- `import { counterSlice } from "../pages/counter/counterSlice";`

  - Burada slice nesnesinin kendisi import ediliyor. Slice nesnesinden `counterSlice.reducer` şeklinde reducer'a erişiliyor.
  - Alternatif olarak `import counterReducer from "../pages/counter/counterSlice";` şeklinde doğrudan default export edilen reducer'ı alabilirsiniz (projedeki `counterSlice.js`'in son satırı `export default counterSlice.reducer;` olduğu için bu daha sade olur).

- `export const store = configureStore({ reducer: { counter:counterSlice.reducer, }, });`
  - `reducer` objesinin anahtarları state ağacında görülecek isimlerdir: örn. `state.counter.value`.
  - İleride başka slice'lar eklediğinizde burada `products`, `cart` vb. olarak genişletebilirsiniz.

---

## Bileşenlerde Kullanım Örneği

Basit bir Counter bileşeni nasıl görünür:

```javascript
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
} from "../../pages/counter/counterSlice";

export default function Counter() {
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Counter: {value}</h2>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

Notlar:

- `useSelector` ile store'daki `state.counter.value` okunur.
- `dispatch(increment())` gibi action creator'lar doğrudan dispatch edilir.
- Selector fonksiyonları mümkün olduğunca dar ve basit tutulmalı; ağır hesaplamalar memoize edilmelidir.

---

## Test & Doğrulama

- Reducer fonksiyonlarını birim test ile doğrulayın. Örnek (jest):

```javascript
import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
} from "./counterSlice";

test("increment", () => {
  const initialState = { value: 0 };
  const nextState = counterReducer(initialState, increment());
  expect(nextState.value).toBe(1);
});
```

- `configureStore` kullanılarak entegre testler de yazılabilir: gerçek store ile dispatch edip sonuçları kontrol edebilirsiniz.

---

## Hata Durumları ve İyi Uygulamalar

- `state.counter` undefined hatası: `store.js` içinde `counter` reducer'ı eklenmemişse `useSelector(state => state.counter.value)` çağrısı hata verir. Reducer'ı doğru şekilde `configureStore`'a ekleyin.
- Action payload validation: `incrementByAmount` gibi action'larda gelen payload'ın tipini beklenen şekilde kontrol etmek (ör. sayıya çevirme veya guard) iyi olur.
- Büyük uygulamalarda `slices/` veya `features/` alt klasörü düzeni; index reducer dosyası oluşturma ve `combineReducers` yerine `configureStore`'un objesi tercih edilir.
- TypeScript kullanıyorsanız `RootState` ve `AppDispatch` tiplerini tanımlayın:

```ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## Özet

- `counterSlice.js` küçük ve anlaşılır bir slice örneğidir: initial state, reducer'lar, action'lar.
- `store.js` bu reducer'ı store'a bağlar; `state.counter.value` şeklinde erişim sağlar.
- Bileşenlerde `useSelector`/`useDispatch` ile kolayca kullanılabilir.

Eğer isterseniz ben bu dokümanda yer alan `Counter` bileşenini gerçek bir dosya olarak workspace'e ekleyip kısa bir smoke-test çalıştırabilirim (uygulamayı başlatıp sayfanın render'ını kontrol etmek gibi). Hangi adımı istersiniz?
