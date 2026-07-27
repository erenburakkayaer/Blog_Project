# Blog_Project — Backend (BlogProject.API)

*[Read in English](README.en.md)*

Kurumsal Web Sitesi & İçerik Yönetim Sistemi (CMS) — backend tarafı.
ASP.NET Core Web API, .NET 10, SQL Server (Code-First / EF Core), N-Tier (katmanlı) mimari.

## Mimari

```
BlogProject.API/
├── Entities/        # Veritabanı tablolarının karşılığı sınıflar (22 tablo)
├── DTO/             # Dışarı/içeri taşınan veri paketleri
├── Interfaces/      # Repository/Service sözleşmeleri
├── Repositories/     # Sadece CRUD — GenericRepository<T> + entity'ye özel repository'ler
├── Services/         # İş kuralları — özel servisler (Blog, User, Role, Auth, Comment,
│                     #   Message, Dashboard, Log, FileStorage) + basit modüller için
│                     #   ortak GenericCrudService
├── Authentication/   # JWT üretimi (TokenService) ve giriş iş kuralı (AuthService)
├── Middlewares/       # Global exception handling
├── Helpers/           # PasswordHasher, SlugGenerator, RoleNames, AutoMapper profili
├── Data/              # AppDbContext, DbSeeder
├── Migrations/        # EF Core Code-First migration'ları
└── Controllers/       # HTTP uç noktaları (sunum katmanı)

BlogProject.Tests/      # 25 birim/entegrasyon testi (EF Core InMemory ile)
```

## Yapılan İşler

- **22 tablo**: User, Role, Permission, Blog, Category, Comment, Page, Slider, Service,
  Project, ProjectImage, Reference, Career, Application, Message, Offer, Gallery, File,
  Setting, SeoSetting, Log, RefreshToken.
- **JWT Authentication**: giriş, access token + refresh token (7 gün, rotasyonlu), rol
  bazlı yetkilendirme (SuperAdmin/Admin/Editor/Yazar).
- **45+ API endpoint**: her tablo için listeleme (sayfalama + arama), detay, ekleme,
  güncelleme, silme; ziyaretçiye açık olanlar (blog okuma, yorum/mesaj/teklif gönderme)
  ile personel yetkisi gerektirenler net ayrıldı.
- **Dosya yükleme** servisi (CV/görsel, boyut/format kontrolü).
- **Dashboard** özet/son-içerik/son-aktivite uçları.
- **Cross-cutting**: global hata yönetimi, CORS, Serilog loglama, rate limiting.
- **25 otomatik test** (giriş/çıkış senaryoları, iş kuralları, arama/filtreleme).
- **Gerçek veritabanı**: migration oluşturulup uygulandı, uçtan uca doğrulandı (gerçek
  giriş, gerçek veri oluşturma).

## Gereksinimler

- .NET SDK 10
- SQL Server (yerel geliştirmede Docker/Colima ile `azure-sql-edge` kullanılıyor)

## Çalıştırma

```bash
cd BlogProject.API
dotnet restore
dotnet run
```

Swagger arayüzü: `http://localhost:<port>/swagger`

## Veritabanı

`appsettings.Development.json` içindeki `ConnectionStrings:DefaultConnection` gerçek
bağlantıyı içerir (bu dosya `.gitignore` ile commit edilmez). Migration'ı yeniden
oluşturmak/güncellemek için:

```bash
cd BlogProject.API
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## Testleri Çalıştırma

```bash
cd BlogProject.Tests
dotnet test
```

## JWT / Kimlik Doğrulama

- `Jwt:Key` gizlidir, `appsettings.Development.json` içinde tutulur.
- `POST /api/auth/login` → access token (60 dk) + refresh token (7 gün)
- `POST /api/auth/refresh` → refresh token rotasyonu ile yeni access token
- Korumalı uçlara `Authorization: Bearer <token>` header'ı ile erişilir
- Varsayılan admin: `admin` / `Admin123!` (ilk girişten sonra değiştirilmeli)

## Dokümantasyon

- `docs/BlogProject.postman_collection.json` — Swagger'dan otomatik üretilen Postman
  koleksiyonu
- `docs/ER_DIAGRAM.md` — 22 tablonun ilişki diyagramı (Mermaid)
