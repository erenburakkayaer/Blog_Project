# ER Diyagramı

Backend'de tanımlı 21 tablo ve aralarındaki ilişkiler. GitHub bu diyagramı
otomatik render eder (Mermaid).

```mermaid
erDiagram
    ROLE ||--o{ USER : "sahip olur"
    USER ||--o{ BLOG : "yazar"
    USER ||--o{ REFRESH_TOKEN : "sahiptir"
    CATEGORY ||--o{ BLOG : "kategorilendirir"
    CATEGORY ||--o{ PROJECT : "kategorilendirir"
    CATEGORY ||--o{ COMPANY_SERVICE : "kategorilendirir"
    BLOG ||--o{ COMMENT : "alır"
    PROJECT ||--o{ PROJECT_IMAGE : "içerir"
    CAREER ||--o{ APPLICATION : "alır"

    ROLE {
        int Id PK
        string Name
    }
    USER {
        int Id PK
        string Username
        string Email
        string PasswordHash
        int RoleId FK
        bool IsActive
        datetime CreatedAt
        datetime LastLoginAt
    }
    REFRESH_TOKEN {
        int Id PK
        int UserId FK
        string Token
        datetime ExpiresAt
        datetime RevokedAt
    }
    PERMISSION {
        int Id PK
        string Name
        string Description
    }
    CATEGORY {
        int Id PK
        string Name
        string Slug
        string Type "Blog | Service | Project"
    }
    BLOG {
        int Id PK
        string Title
        string Slug
        string Content
        int AuthorId FK
        int CategoryId FK
        bool IsPublished
        int ViewCount
        datetime CreatedAt
        datetime PublishedAt
    }
    COMMENT {
        int Id PK
        int BlogId FK
        string Name
        string Email
        string Content
        bool IsApproved
        datetime CreatedAt
    }
    PAGE {
        int Id PK
        string Slug
        string Title
        string Content
    }
    SLIDER {
        int Id PK
        string Title
        string ImageUrl
        int DisplayOrder
        bool IsActive
    }
    COMPANY_SERVICE {
        int Id PK
        string Title
        string Slug
        int CategoryId FK
        bool IsActive
    }
    PROJECT {
        int Id PK
        string Title
        string Slug
        int CategoryId FK
        string ClientName
        datetime CompletedAt
    }
    PROJECT_IMAGE {
        int Id PK
        int ProjectId FK
        string ImageUrl
    }
    REFERENCE {
        int Id PK
        string Name
        string LogoUrl
        string WebsiteUrl
    }
    MESSAGE {
        int Id PK
        string Name
        string Email
        string Subject
        string Content
        bool IsRead
        datetime CreatedAt
    }
    OFFER {
        int Id PK
        string CompanyName
        string FullName
        int ServiceId
        string Status
        datetime CreatedAt
    }
    CAREER {
        int Id PK
        string Title
        string Location
        bool IsActive
    }
    APPLICATION {
        int Id PK
        int CareerId FK
        string FullName
        string CvFileUrl
        bool IsReviewed
        datetime CreatedAt
    }
    GALLERY_ITEM {
        int Id PK
        string Title
        string ImageUrl
    }
    FILE_ASSET {
        int Id PK
        string FileName
        string FilePath
        long SizeBytes
        datetime UploadedAt
    }
    SETTING {
        int Id PK
        string Key
        string Value
    }
    SEO_SETTING {
        int Id PK
        string PageKey
        string MetaTitle
    }
    LOG {
        int Id PK
        int UserId
        string Action
        datetime CreatedAt
    }
```

## Notlar

- `Offer.ServiceId` ve `Log.UserId` şu an plain `int` — henüz navigation property
  olarak bağlanmadı (ihtiyaç oldukça eklenecek).
- Gerçek veritabanı henüz kurulmadı; bu diyagram `BlogProject.API/Entities/`
  altındaki C# sınıflarından çıkarılmıştır, migration'lar oluşturulunca SQL
  şeması bununla birebir eşleşecektir.
