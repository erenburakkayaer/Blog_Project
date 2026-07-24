# Blog_Project — Backend (BlogProject.API)

Kurumsal Web Sitesi & İçerik Yönetim Sistemi (CMS) staj projesinin backend'i.
ASP.NET Core Web API, .NET 10, N-Tier (katmanlı) mimari.

## Ekip

| Ekip | Üyeler | Sorumluluk |
|---|---|---|
| Backend | Burak & Mehdi | Veritabanı tasarımı, REST API, JWT, iş mantığı |
| Frontend | Samet & Cuma | Arayüz, Admin Panel, API entegrasyonu |

## Katmanlı Mimari

```
BlogProject.API/
├── Entities/        # Veritabanı tablolarının karşılığı sınıflar
├── DTO/             # Dışarı/içeri taşınan veri paketleri
├── Interfaces/      # Repository/Service sözleşmeleri (DIP)
├── Repositories/     # Sadece CRUD — GenericRepository<T> + entity'ye özel repository'ler
├── Services/         # İş kuralları — özel servisler (Blog, User, Role, Log, FileStorage)
│                     #   + basit CRUD modülleri için ortak GenericCrudService
├── Authentication/   # JWT üretimi (TokenService) ve giriş iş kuralı (AuthService)
├── Middlewares/       # Global exception handling
├── Helpers/           # PasswordHasher, RoleNames, AutoMapper profili
├── Data/              # AppDbContext
└── Controllers/       # HTTP uç noktaları (sunum katmanı)
```

Basit CRUD modülleri (Category, Page, Slider, CompanyService, Project, ProjectImage,
Reference, Career, GalleryItem, Setting, SeoSetting, Permission, Comment, Message,
Offer, Application) ortak `IGenericCrudService`'i kullanır. Gerçek iş kuralı olan
Blog, User, Role, Auth, Log ve dosya yükleme kendi özel servisine sahiptir.

## Gereksinimler

- .NET SDK 10
- SQL Server (henüz kurulmadı — bkz. "Veritabanı" bölümü)

## Çalıştırma

```bash
cd BlogProject.API
dotnet restore
dotnet run
```

Swagger arayüzü: `https://localhost:<port>/swagger`

## Veritabanı

`appsettings.json` içindeki `ConnectionStrings:DefaultConnection` şu an bir
**placeholder**dır — henüz gerçek bir SQL Server'a bağlanılmadı ve migration
çalıştırılmadı. Gerçek veritabanı hazır olduğunda:

```bash
cd BlogProject.API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## JWT / Kimlik Doğrulama

- `Jwt:Key` **gizlidir** — `appsettings.Development.json` içinde tutulur, bu dosya
  `.gitignore` ile commit edilmez. Yeni bir geliştirme ortamı kurarken kendi
  anahtarınızı üretin: `openssl rand -base64 48`
- `POST /api/auth/login` → access token (60 dk) + refresh token (7 gün)
- `POST /api/auth/refresh` → refresh token rotasyonu ile yeni access token
- Korumalı uçlara `Authorization: Bearer <token>` header'ı ile erişilir
- Roller: `SuperAdmin`, `Admin`, `Editor`, `Yazar` (bkz. `Helpers/RoleNames.cs`)
- Ziyaretçi kendi kendine kayıt olamaz — kullanıcılar sadece Admin/SuperAdmin
  tarafından `POST /api/users` ile oluşturulur

## Frontend Entegrasyonu

- CORS: `appsettings.json` → `Cors:AllowedOrigins` (varsayılan
  `http://localhost:3000`, `http://localhost:5173`). React projesi farklı bir
  portta çalışıyorsa burayı güncelleyin.
- Postman Collection: `docs/BlogProject.postman_collection.json` (Swagger
  şemasından otomatik üretildi — `baseUrl` ve `accessToken` collection
  değişkenlerini ayarlayıp kullanabilirsiniz)
- Dosya yükleme: `POST /api/files/upload` (multipart/form-data) → dönen `url`
  alanı, Offer/Application formlarındaki `FileUrl`/`CvFileUrl` alanlarına konur

## Henüz Yapılmadı

- Gerçek SQL Server bağlantısı, migration, seed data
- Pagination'a arama/filtreleme parametrelerinin eklenmesi (şu an sadece `page`/`pageSize` var)
- Yorum/mesaj/teklif modüllerinde ek iş kuralları (bildirim, e-posta vb.)
