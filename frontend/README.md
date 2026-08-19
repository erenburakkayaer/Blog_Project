# ⚡ TechNova — Geliştirici & İçerik Yönetim Platformu (Frontend)

<p align="center">
  <strong>Uslukılıç Yazılım</strong> • Bozok Teknopark, Bozok Ünv. Erdoğan Akdağ Kampüsü / Yozgat<br>
  <em>4 Kişilik Staj Ekibi Geliştirme Projesi</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.1-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/ASP.NET_Core_10-Backend_Ready-512bd4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10" />
  <img src="https://img.shields.io/badge/Durum-Production_Ready-success?style=for-the-badge" alt="Durum" />
</p>

---

## 📖 Proje Hakkında

**TechNova**, yazılımcıların ve içerik üreticilerinin projelerini sergileyebileceği, teknik blog yazıları yayınlayabileceği, okundukça gelir elde edebileceği ve kurumsal yazılım hizmeti teklifi alabileceği modern bir web platformudur.

### 🌟 Öne Çıkan Özellikler

- 🤖 **Yapay Zekâ (AI) Chatbot:** Her sayfada sağ altta hizmetler, teklifler ve yazar programı hakkında anında yanıt veren interaktif asistan.
- 💰 **Yazar Kazanç Sistemi:** Okunma başına gelir hesaplama (~1.000 okunma = ~₺250), anlık bakiye takibi ve IBAN ile ödeme talep etme modalı.
- 🚀 **Proje Vitrini & Boost:** Proje yükleme (.zip, .apk, .pdf desteği) ve 7 / 30 günlük öne çıkarma (boost) paketleri.
- 📝 **Canlı Blog & Proje CRUD:** Modal üzerinden anında makale yazma, proje ekleme, düzenleme ve silme.
- 📋 **3 Adımlı Teklif Sihirbazı:** Hizmet türü, bütçe aralığı ve proje detaylarına göre interaktif fiyat teklif formu.
- 🔐 **Profesyonel Split-Screen Auth:** Karanlık tema, sekmeli Giriş/Kayıt, Rol seçimi (Yazar/Geliştirici/Şirket), Şifremi Unuttum modalı.
- ⚙️ **Kapsamlı Admin Paneli:** Finansal özet, istatistikler, blog, proje, hizmet, kullanıcı ve mesaj yönetimi.
- 📱 **%100 Responsive:** Masaüstü, tablet ve mobil cihazlarla kusursuz uyum.

---

## 🚀 Hızlı Başlangıç (Kurulum & Çalıştırma)

### 1. Gereksinimler
- **Node.js:** v18.0 veya üzeri ([Node.js İndir](https://nodejs.org/))
- **npm:** v9.0 veya üzeri

### 2. Projeyi Klonlayın ve Klasöre Geçin
```bash
git clone https://github.com/erenburakkayaer/Blog_Project.git
cd Blog_Project/frontend
```

### 3. Bağımlılıkları Yükleyin
```bash
npm install
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Sunucu başladığında tarayıcınızda şu adresi açın:  
👉 **http://localhost:5174/** (veya terminalde belirtilen port)

---

## 🔑 Test & Giriş Bilgileri

Sistem varsayılan olarak **Mock Veri Modu** ile çalışır; backend ayağa kalkmadan tüm arayüzü ve işlevleri test edebilirsiniz:

| Rol | E-posta | Kullanıcı Adı | Şifre | Yetki |
|---|---|---|---|---|
| **Yönetici (Admin)** | `admin@technova.com` | `admin` | `Admin123!` | Tüm Yönetim Paneli (`/admin`) |
| **Yazar / Editör** | `yazar@technova.com` | `yazar` | `Yazar123!` | Blog & Proje Yönetimi |

---

## 🔌 Backend (.NET 10 / SQL Server) Entegrasyonu

Backend ekibi (**BlogProject.API — Burak & Mehdide**) ile tam uyumlu bağlantı kurmak için:

1. **`.env` Dosyasını Düzenleyin:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   *(Backend'inizin çalıştığı gerçek portu yazın, örn: `5000`, `5242` vb.)*

2. **Mock Modunu Kapatın:**
   `src/services/api.js` dosyasına gidin:
   ```javascript
   export const USE_MOCK_DATA = false; // ← true olan değeri false yapın
   ```

3. Frontend artık tüm istekleri doğrudan **ASP.NET Core Web API** uç noktalarına JWT Access + Refresh Token desteğiyle iletir.

> 📚 Detaylı 22 Tablo DDL ve 45+ REST API Endpoint listesi için [`BACKEND_INTEGRATION_GUIDE.md`](./BACKEND_INTEGRATION_GUIDE.md) dosyasını inceleyin.

---

## 📁 Proje Dizin Yapısı

```
frontend/
├── src/
│   ├── assets/              # Özel CSS, fontlar ve görseller
│   │   └── styles/          # global.css (tasarım sistemi & chatbot stilleri)
│   ├── components/
│   │   ├── admin/           # Admin paneli özel bileşenleri
│   │   ├── common/          # Ortak yardımcı bileşenler
│   │   ├── site/            # Navbar, Footer, AIChatbot.jsx
│   │   └── ui/              # Butonlar, modallar, form kontrolleri
│   ├── context/             # React Context (Auth & Site Provider)
│   ├── hooks/               # useAuth ve özel React kancaları
│   ├── layouts/             # SiteLayout, AdminLayout, AuthLayout
│   ├── pages/
│   │   ├── admin/           # Dashboard, Blog, Projeler, Hizmetler, Kullanıcılar
│   │   ├── auth/            # LoginPage.jsx (Giriş/Kayıt/Şifremi Unuttum)
│   │   └── site/            # Home, About, Services, Projects, Blog, Offer vb.
│   ├── routes/              # AppRoutes.jsx & ProtectedRoute.jsx
│   └── services/            # api.js, authService, blogService, projectService, uploadService
├── .env                     # Ortam değişkenleri
├── BACKEND_INTEGRATION_GUIDE.md # Backend entegrasyon rehberi
├── PROJE_GELISTIRME_RAPORU.md   # Detaylı proje geliştirme raporu
├── package.json
└── README.md
```

---

## 🛠️ Kullanılabilir Komutlar (Scripts)

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme (development) sunucusunu başlatır |
| `npm run build` | Canlı dağıtım için optimize edilmiş `dist/` paketini oluşturur |
| `npm run preview` | Oluşturulan `dist/` derlemesini yerel olarak önizler |
| `npm run lint` | ESLint ile kod kalite kontrolü yapar |

---

## 👥 Ekip (Uslukılıç Yazılım Staj Ekibi)

- **Frontend:** Samet & Ekip Arkadaşı (React, Vite, UI/UX, Servis Mimarisi)
- **Backend:** Burak & Mehdide (ASP.NET Core .NET 10, SQL Server, EF Core, N-Tier Mimari)
- **Kurum:** Bozok Teknopark, Yozgat
