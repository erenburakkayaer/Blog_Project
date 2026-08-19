# 🔌 TechNova Frontend ↔ ASP.NET Core (.NET 10) Backend Entegrasyon Rehberi

Bu belge, **Uslukılıç Yazılım** staj ekibindeki backend geliştiricileri (**BlogProject.API — Burak & Mehdide**) ile frontend ekibi (**Samet & Arkadaşı**) arasındaki tam entegrasyonu sağlamak için hazırlanmıştır.

---

## 🏛️ 1. Backend Mimarisi ve Teknoloji Özeti

- **Framework:** ASP.NET Core Web API (.NET 10)
- **Veritabanı:** Microsoft SQL Server (Code-First / EF Core Migration)
- **Mimari:** N-Tier (Katmanlı) Mimari (`Entities`, `DTO`, `Interfaces`, `Repositories`, `Services`, `Controllers`)
- **Mapping:** AutoMapper / Mapster
- **Test:** `BlogProject.Tests` (25 Birim & Entegrasyon Testi, EF Core InMemory)
- **Dokümantasyon:** Swagger UI (`/swagger`) & Postman Koleksiyonu (`docs/BlogProject.postman_collection.json`)

---

## 🗄️ 2. Veritabanı Tablo Eşleşmesi (22 Tablo)

| # | Entity | Açıklama | Frontend Karşılığı |
|---|---|---|---|
| 1 | **User** | Kullanıcılar, kimlik ve profil verileri | `/admin/kullanicilar`, Auth |
| 2 | **Role** | Roller (`SuperAdmin`, `Admin`, `Editor`, `Yazar`) | Role-based Authorization |
| 3 | **Permission** | Sayfa ve işlem bazlı yetkilendirme | ProtectedRoute |
| 4 | **RefreshToken** | 7 günlük rotasyonlu token kayıtları | `api.js` (Otomatik yenileme) |
| 5 | **Blog** | Makaleler, okunma, kazanç, yazar bilgisi | `/blog`, `/admin/blog` |
| 6 | **Category** | Blog & Proje kategorileri | Filtreleme ve arama |
| 7 | **Comment** | Ziyaretçi/Kullanıcı blog yorumları | Blog Detay Yorumları |
| 8 | **Project** | Portföy projeleri, linkler, boost durumu | `/projeler`, `/admin/projeler` |
| 9 | **ProjectImage** | Projelere ait çoklu görsel galerisi | Proje detay & önizleme |
| 10 | **Service** | Web, Mobil, AI, Siber Güvenlik hizmetleri | `/hizmetler`, `/admin/hizmetler` |
| 11 | **Offer** | 3 adımlı teklif sihirbazı talepleri | `/teklif-al`, `/admin/mesajlar` |
| 12 | **Message** | İletişim formu mesajları | `/iletisim`, `/admin/mesajlar` |
| 13 | **Career** | Açık staj & iş ilanları | `/kariyer` |
| 14 | **Application** | Kariyer iş/staj başvuruları ve CV'ler | `/kariyer` başvuru formu |
| 15 | **Reference** | Müşteri yorumları ve iş ortakları | `/referanslar` |
| 16 | **Slider** | Ana sayfa slider/banner bileşenleri | `/` Hero alanı |
| 17 | **Page** | Dinamik sayfalar (Hakkımızda, Gizlilik vb.) | Site sayfaları |
| 18 | **Gallery** | Medya ve görsel galerisi | Görsel yönetimi |
| 19 | **File** | Yüklenen dosyalar (CV, .zip, .apk, .pdf) | `uploadService.js` |
| 20 | **Setting** | Şirket iletişim, telefon, adres ayarları | `/admin/ayarlar`, Footer, Navbar |
| 21 | **SeoSetting** | Meta tag, title, description SEO verileri | `index.html`, React Helmet |
| 22 | **Log** | Sistem işlem ve Serilog hata kayıtları | Dashboard logları |

---

## 🔑 3. Kimlik Doğrulama (JWT Access + Refresh Token)

### A. Giriş (Login)
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin@technova.com",
    "password": "Admin123!"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "7d-refresh-token-string...",
    "expiresIn": 3600,
    "user": {
      "id": 1,
      "fullName": "Samet Başkale",
      "email": "admin@technova.com",
      "roles": ["SuperAdmin", "Admin"]
    }
  }
  ```

### B. Token Yenileme (Refresh Token Rotasyonu)
- **Endpoint:** `POST /api/auth/refresh`
- **Request Body:**
  ```json
  {
    "refreshToken": "7d-refresh-token-string..."
  }
  ```
- **Response:** Yeni `accessToken` + yeni `refreshToken` döner. Frontend'deki `api.js` interceptor'ı 401 hatası aldığında bu işlemi otomatik gerçekleştirir.

---

## 📡 4. Frontend Servisleri ve REST Endpoint Eşleşmesi

| Frontend Servisi | Dosya | Backend (.NET 10 API) Uç Noktaları |
|---|---|---|
| `authService` | `src/services/authService.js` | `POST /api/auth/login`<br>`POST /api/auth/register`<br>`POST /api/auth/refresh`<br>`GET /api/auth/me` |
| `blogService` | `src/services/blogService.js` | `GET /api/blogs` (sayfalama + arama)<br>`GET /api/blogs/{id}`<br>`POST /api/blogs`<br>`PUT /api/blogs/{id}`<br>`DELETE /api/blogs/{id}` |
| `projectService` | `src/services/projectService.js` | `GET /api/projects`<br>`GET /api/projects/{id}`<br>`POST /api/projects`<br>`PUT /api/projects/{id}`<br>`DELETE /api/projects/{id}`<br>`POST /api/projects/{id}/boost` |
| `uploadService` | `src/services/uploadService.js` | `POST /api/upload` (veya `/api/file`, Multipart Form Data)<br>`DELETE /api/upload/{id}` |
| `serviceService` | `src/services/serviceService.js` | `GET/POST/PUT/DELETE /api/services` |
| `messageService` | `src/services/messageService.js` | `GET/POST/PUT/DELETE /api/messages`<br>`POST /api/offers` |
| `userService` | `src/services/userService.js` | `GET/POST/PUT/DELETE /api/users`<br>`GET /api/roles` |

---

## ⚙️ 5. Frontend'i Canlı Backend'e Bağlama

1. **`.env` dosyasını güncelleyin:**
   ```env
   # Backend portunuza göre düzenleyin:
   VITE_API_URL=http://localhost:5000/api
   ```
2. **`src/services/api.js` dosyasında mock modunu kapatın:**
   ```javascript
   export const USE_MOCK_DATA = false;
   ```
3. `npm run dev` ile frontend'i başlatın. Frontend artık tüm istekleri doğrudan **ASP.NET Core Web API**'ye iletir!
