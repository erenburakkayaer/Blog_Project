# 🚀 TechNova — Platform Geliştirme ve Entegrasyon Dokümantasyonu

**Şirket / Ekip:** Uslukılıç Yazılım  
**Lokasyon:** Bozok Teknopark, Bozok Üniversitesi Erdoğan Akdağ Kampüsü / Yozgat  
**Ekip Yapısı:** 4 Kişilik Staj Ekibi (2 Frontend + 2 Backend/Veritabanı)  
**Aktif Dal (Branch):** `frontend/samet`  

---

## 📌 1. Proje Özeti ve Amacı
TechNova; yazılımcıların ve içerik üreticilerinin projelerini sergileyebileceği, teknik blog yazıları yayınlayabileceği ve okundukça gelir elde edebileceği modern, dinamik ve ölçeklenebilir bir geliştirici platformudur.

### 💡 İş ve Gelir Modeli (Monetization Architecture)
1. **Yazar Kazanç Programı (Revenue Share):**
   - Yazarlar yayınladıkları blogların okunma sayısına göre gelir kazanır (Referans: ~1.000 okunma = ~₺250).
   - Asgari çekim eşiği: ₺500.
   - Her ayın 1'inde IBAN üzerinden otomatik/manuel ödeme talebi oluşturma.
2. **Proje Vitrini & Boost (Öne Çıkarma):**
   - Kullanıcılar açık (public) veya gizli/özel (private pro) projeler yükleyebilir (.zip, .apk, .pdf vb.).
   - Projelerini vitrinde üst sıralara taşımak için 7 veya 30 günlük **Boost** paketleri satın alabilirler.
3. **Şirket Hizmetleri & Teklif Sistemi:**
   - Web, Mobil, Yapay Zekâ ve Siber Güvenlik hizmetleri için 3 adımlı dinamik interaktif teklif sihirbazı.

---

## 🏗️ 2. Frontend Mimarisi ve Teknoloji Yığını

- **Çatı:** React 19 + Vite (Hızlı HMR, modern modüler yapı)
- **Stil & Tasarım:** Vanilla Modern CSS + HSL renk tokenları + Bootstrap Icons (Özel Glassmorphism & Dark Mode)
- **Yönlendirme (Routing):** `react-router-dom` v6 (Public, Auth, Admin alt rotaları)
- **Form & Doğrulama:** `react-hook-form` + `react-hot-toast`
- **İletişim & Bot:** Dahili TechNova AI Asistanı (Yapay Zekâ Chatbot)

---

## 📱 3. Sayfa ve Modül Durumu

### 🌐 A. Kullanıcı Arayüzü (Public Site)
| Sayfa | Route | Açıklama / Özellikler |
|---|---|---|
| **Ana Sayfa** | `/` | Hero alanı, istatistik sayaçları, öne çıkan projeler, bloglar, AI Chatbot |
| **Hakkımızda** | `/hakkimizda` | Şirket vizyonu, teknopark bilgisi, 4 kişilik ekip tanıtımı |
| **Hizmetler** | `/hizmetler` | Web, Mobil, AI, Siber Güvenlik detaylı hizmet kartları |
| **Projeler** | `/projeler` | Canlı Proje Ekleme modalı, Dosya Yükleme (.zip/.apk/.pdf), Boost modalı, filtreleme |
| **Blog** | `/blog` | Blog Yazı Ekleme modalı, detay okuma, kategori filtreleri, tahmini kazanç rozetleri |
| **Kazanç Programı** | `/kazanc-programi` | Gelir simülasyon slider'ı, SSS, başvuru adımları |
| **Teklif Al** | `/teklif-al` | 3 adımlı interaktif fiyat/kapsam teklif formu |
| **Kariyer & Staj** | `/kariyer` | Açık pozisyonlar, staj başvuru formu |
| **İletişim** | `/iletisim` | Harita konumu, iletişim formu, Teknopark adres bilgisi |
| **SSS** | `/sss` | Akordeon formatında sıkça sorulan sorular |
| **Referanslar** | `/referanslar` | Müşteri yorumları ve iş ortakları |

### 🔐 B. Kimlik Doğrulama (Auth)
| Sayfa | Route | Özellikler |
|---|---|---|
| **Giriş & Kayıt** | `/giris` | Split-Screen tasarım, Tabbed Giriş/Kayıt, Rol Seçimi (Yazar/Geliştirici/Şirket), Şifremi Unuttum modalı, Google/GitHub simülasyonu |

### ⚙️ C. Yönetim Paneli (Admin Dashboard)
| Sayfa | Route | Özellikler |
|---|---|---|
| **Dashboard** | `/admin` | Canlı bakiye kartı, IBAN Ödeme Talep Modalı, sistem istatistikleri, son aktiviteler |
| **Blog Yönetimi** | `/admin/blog` | Blog listeleme, arama/filtreleme, silme |
| **Yeni Blog Ekle** | `/admin/blog/yeni` | Görsel yükleme/URL, zengin metin alanı, kategori ve durum seçimi |
| **Blog Düzenle** | `/admin/blog/:id` | Mevcut blogu güncelleme |
| **Proje Yönetimi** | `/admin/projeler` | Tablo görünümü, durum ve teknoloji filtreleri, silme |
| **Yeni Proje Ekle** | `/admin/projeler/yeni` | Portföy projesi ekleme formu |
| **Hizmet Yönetimi** | `/admin/hizmetler` | Hizmet listesi ve CRUD |
| **Kullanıcılar** | `/admin/kullanicilar` | Kullanıcı rol yönetimi (Admin, Editor, Author) |
| **Gelen Mesajlar** | `/admin/mesajlar` | İletişim ve teklif mesajları |
| **Ayarlar** | `/admin/ayarlar` | Sistem ve şirket profil ayarları |

---

## 🤖 4. Yapay Zekâ (AI) Chatbot Bileşeni
- **Konum:** Tüm site sayfalarında sağ alt köşede yüzer (floating) buton.
- **Yetenekler:** 
  - Hizmetler, yazar programı, teklif alma ve iletişim sorularına anında akıllı yanıt.
  - Hızlı seçim butonları (Quick Replies).
  - Gerçekçi yazıyor animasyonu (`typing`).
  - Mobil cihazlarda tam ekran uyumu.

---

## 🔌 5. Backend ve Veritabanı Entegrasyon Rehberi

Backend geliştiren ekip arkadaşlarının frontend'e bağlanması için gereken her şey standardize edilmiştir.

### 1 Adımda Mock Modundan Gerçek Backend'e Geçiş:
`src/services/api.js` dosyası içindeki:
```javascript
export const USE_MOCK_DATA = false; // ← true olan değeri false yapmanız yeterlidir.
```

`.env` dosyası:
```env
VITE_API_URL=http://localhost:5000/api
```

### Servis Mimarisi:
- `authService.js` ➡️ `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- `projectService.js` ➡️ `/api/projects`, `/api/projects/:id`, `/api/projects/:id/boost`
- `blogService.js` ➡️ `/api/blogs`, `/api/blogs/:id`
- `uploadService.js` ➡️ `/api/upload` (Multipart Form-Data)
- `serviceService.js` ➡️ `/api/services`
- `userService.js` ➡️ `/api/users`

Detaylı SQL PostgreSQL tablo şemaları ve REST sözleşmeleri için: `BACKEND_INTEGRATION_GUIDE.md` dosyası mevcuttur.

---

## 🧪 6. Test ve Çalıştırma

```bash
# Bağımlılıkları yükleme
npm install

# Geliştirme sunucusu
npm run dev

# Canlı (Production) Derleme
npm run build
```

**Varsayılan Test Giriş Bilgileri:**
- **E-posta:** `admin@technova.com`
- **Şifre:** `Admin123!`
