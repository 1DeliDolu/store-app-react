# POST İstekleri — Axios (Modern)

Axios ile POST isteği göndermenin modern yolu async/await kullanmaktır. Aşağıda hem async/await hem de Promise zinciri (then/catch) örnekleri yer alır.

## Örnek: async/await ile POST
```javascript
import axios from 'axios';

async function createUser() {
    try {
        const payload = { firstName: 'Efe', lastName: 'Ceylan' };
        const response = await axios.post('/user', payload);
        console.log(response.data);
    } catch (error) {
        console.error('POST hatası:', error);
    }
}
```

## Örnek: then/catch ile POST
```javascript
axios.post('/user', {
    firstName: 'Efe',
    lastName: 'Ceylan'
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});
```

## Birden çok eşzamanlı istek (Promise.all) — async/await ile
```javascript
function getUserAccount() {
    return axios.get('/user/12345');
}

function getUserPermissions() {
    return axios.get('/user/12345/permissions');
}

async function fetchUserData() {
    try {
        const [acctRes, permRes] = await Promise.all([
            getUserAccount(),
            getUserPermissions()
        ]);
        const account = acctRes.data;
        const permissions = permRes.data;
        console.log({ account, permissions });
    } catch (error) {
        console.error('İsteklerde hata:', error);
    }
}
```

Not: JSON gövde ve özel başlıklar gerekiyorsa axios.post çağrısına üçüncü argüman olarak headers ekleyebilirsiniz:
```javascript
axios.post('/user', payload, { headers: { 'Content-Type': 'application/json' } });
```