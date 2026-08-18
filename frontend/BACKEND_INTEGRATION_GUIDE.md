# TechNova — Backend & Veritabanı Entegrasyon Rehberi 🚀

> **Hedef:** Backend ve Veritabanı geliştiren 2 arkadaşımızın Node.js/Express ve PostgreSQL altyapısını React frontend ile sıfır eforla bağlaması.

---

## 1. ⚙️ Hızlı Kurulum & Bağlantı
Proje kök dizininde veya `src/services/api.js` dosyasında:

```javascript
// src/services/api.js
const API_BASE_URL = "http://localhost:5000/api";
export const USE_MOCK_DATA = false; // Backend hazır olduğunda false yapınız!
```

---

## 2. 🗄️ PostgreSQL Veritabanı Tablo Şeması (Schema SQL)

```sql
-- 1. Kullanıcılar Tablosu (Users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'yazar', -- 'yazar', 'gelistirici', 'isveren', 'admin'
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projeler Tablosu (Projects)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    tag VARCHAR(100),
    visibility VARCHAR(20) DEFAULT 'Public', -- 'Public' veya 'Private (Pro)'
    boosted BOOLEAN DEFAULT FALSE,
    file_url VARCHAR(255),
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bloglar Tablosu (Blogs)
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    read_time VARCHAR(20) DEFAULT '5 dk',
    views_count INT DEFAULT 0,
    earnings DECIMAL(10, 2) DEFAULT 0.00,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ödeme Talepleri Tablosu (Payouts)
CREATE TABLE payouts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    iban VARCHAR(34) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Beklemede', -- 'Beklemede', 'Onaylandı', 'Reddedildi'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 3. Gerekli REST API Endpoints

### 🔑 Auth API (`/api/auth`)
- `POST /api/auth/register` -> `{ fullName, email, password, role }` -> Token & User Obj
- `POST /api/auth/login` -> `{ email, password }` -> `{ token, user }`
- `GET /api/auth/me` -> Token ile kullanıcı detaylarını ve bakiyesini döner.

### 🚀 Projects API (`/api/projects`)
- `GET /api/projects` -> Tüm projeleri döner (Public ve yetkiye göre Private).
- `POST /api/projects` -> Yeni proje ekler (Multipart dosya destekli).
- `PUT /api/projects/:id` -> Proje günceller.
- `DELETE /api/projects/:id` -> Proje siler.
- `POST /api/projects/:id/boost` -> Projeyi öne çıkarır.

### 📝 Blogs API (`/api/blogs`)
- `GET /api/blogs` -> Blog listesini döner.
- `POST /api/blogs` -> Yeni blog yayınlar.
- `PUT /api/blogs/:id` -> Blog düzenler.
- `DELETE /api/blogs/:id` -> Blog siler.

### 💰 Payouts API (`/api/payouts`)
- `POST /api/payouts/request` -> `{ iban, bankName, amount }` -> Ödeme talebi oluşturur.
