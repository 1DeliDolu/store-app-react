
# Next.js Dokümantasyonu

Next.js dokümantasyonuna hoş geldiniz!  

## Next.js nedir?

Next.js, tam kapsamlı web uygulamaları geliştirmek için kullanılan bir **React framework’üdür**.  
Kullanıcı arayüzlerini oluşturmak için **React Bileşenlerini** kullanırsınız, ek özellikler ve optimizasyonlar için ise **Next.js**’den faydalanırsınız.  

Ayrıca paketleyiciler ve derleyiciler gibi düşük seviyeli araçları otomatik olarak yapılandırır. Böylece ürününüzü geliştirmeye ve hızlıca yayına almaya odaklanabilirsiniz.  

İster bireysel bir geliştirici olun, ister büyük bir ekibin parçası, Next.js etkileşimli, dinamik ve hızlı React uygulamaları oluşturmanıza yardımcı olabilir.  

---

## Dokümantasyon nasıl kullanılır

Dokümantasyon 3 bölümden oluşur:

- **Başlarken**: Yeni bir uygulama oluşturmanıza ve temel Next.js özelliklerini öğrenmenize yardımcı olacak adım adım öğreticiler.  
- **Kılavuzlar**: Belirli kullanım senaryoları için öğreticiler, size uygun olanı seçin.  
- **API Referansı**: Her özellik için ayrıntılı teknik başvuru.  

Bölümler arasında gezinmek için kenar çubuğunu kullanabilir veya **arama (Ctrl+K veya Cmd+K)** ile hızlıca bir sayfa bulabilirsiniz.  

---

## App Router ve Pages Router

Next.js iki farklı router’a sahiptir:

- **App Router**: *Server Components* gibi yeni React özelliklerini destekleyen daha yeni router.  
- **Pages Router**: Orijinal router, hâlâ destekleniyor ve geliştirilmeye devam ediyor.  

Kenar çubuğunun üst kısmında, App Router ve Pages Router dokümantasyonları arasında geçiş yapmanızı sağlayan bir açılır menü göreceksiniz.  

---

## React sürüm yönetimi

App Router ve Pages Router, React sürümlerini farklı şekilde yönetir:

- **App Router**: React **canary sürümlerini** kullanır.  
  Bu sürümler, tüm kararlı React 19 değişikliklerini ve ayrıca yeni bir React sürümünden önce framework’lerde doğrulanan yeni özellikleri içerir.  

- **Pages Router**: Projenizin `package.json` dosyasında yüklü olan React sürümünü kullanır.  

Bu yaklaşım, yeni React özelliklerinin App Router’da güvenilir şekilde çalışmasını sağlarken, mevcut Pages Router uygulamaları için **geriye dönük uyumluluğu** korur.  

---

## Ön bilgi

Dokümantasyonumuzun, web geliştirme hakkında temel bir bilgiye sahip olduğunuzu varsayar.  
Başlamadan önce aşağıdaki konularda rahat olmanız faydalı olacaktır:

- HTML  
- CSS  
- JavaScript  
- React  

React’e yeniyseniz veya hatırlatmaya ihtiyaç duyuyorsanız:  
- **React Foundations** kursumuzla,  
- Uygulama geliştirerek öğrendiğiniz **Next.js Foundations** kursuyla başlamanızı öneririz.  

---

## Erişilebilirlik

Ekran okuyucu kullanırken en iyi deneyim için:  
- **Firefox + NVDA** veya  
- **Safari + VoiceOver** kullanmanızı öneririz.  

---

## Topluluğumuza katılın

Next.js ile ilgili herhangi bir sorunuz varsa, topluluğumuza her zaman şu kanallardan sorularınızı iletebilirsiniz:  

- **GitHub Discussions**  
- **Discord**  
- **X (Twitter)**  
- **Reddit**  

---

## Sonraki Adımlar

İlk uygulamanızı oluşturun ve temel Next.js özelliklerini öğrenin.  
👉 **Başlarken**  
Next.js App Router ile tam kapsamlı web uygulamaları oluşturmayı öğrenin.  


<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Div Flex Gezinti</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0b0c10;
      color: #e9eef5;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .nav {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      border: 1px solid #1f2833;
      border-radius: 12px;
      padding: 16px;
      background: #11151b;
    }
    .btn {
      padding: 10px 20px;
      background: #151a21;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
    }
    .btn:hover {
      background: #1a2029;
    }
  </style>
</head>
<body>
  <div class="nav">
    <div class="btn"><a href="1_Next.js_Docs.md">Önceki</a></div>
    <div class="btn"><a href="2_App_Router.md">Sonraki</a></div>
  </div>
</body>
</html>
