# Travel App 🗺️

แอปพลิเคชันสำหรับจัดการและแชร์ทริปท่องเที่ยว พัฒนาด้วย Spring Boot และ Vue.js

## 📋 สารบัญ

- [คุณสมบัติ](#คุณสมบัติ)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [ความต้องการของระบบ](#ความต้องการของระบบ)
- [การติดตั้ง](#การติดตั้ง)
- [การตั้งค่า](#การตั้งค่า)
- [การรันแอปพลิเคชัน](#การรันแอปพลิเคชัน)
- [API Endpoints](#api-endpoints)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [การใช้งาน Docker](#การใช้งาน-docker)

## ✨ คุณสมบัติ

- 🔐 **ระบบ Authentication**: ลงทะเบียนและเข้าสู่ระบบด้วย JWT
- 📝 **จัดการทริป**: สร้าง แก้ไข และลบทริปท่องเที่ยว
- 🔍 **ค้นหาทริป**: ค้นหาทริปด้วยคำค้นหา
- 📄 **Pagination**: แสดงผลทริปแบบแบ่งหน้า
- 🗺️ **Google Maps**: แสดงตำแหน่งทริปบนแผนที่
- 📸 **รูปภาพ**: อัปโหลดและแสดงรูปภาพทริป
- 🏷️ **Tags**: ใส่แท็กสำหรับจัดหมวดหมู่ทริป
- 📍 **Location**: บันทึกตำแหน่งละติจูดและลองจิจูด

## 🛠️ เทคโนโลยีที่ใช้

### Backend
- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Security** - สำหรับการจัดการความปลอดภัย
- **Spring Data JPA** - สำหรับการจัดการฐานข้อมูล
- **PostgreSQL** - ฐานข้อมูล
- **JWT (JSON Web Token)** - สำหรับการยืนยันตัวตน
- **Maven** - จัดการ dependencies

### Frontend
- **Vue.js 3** - Framework สำหรับ UI
- **Vue Router** - จัดการ routing
- **Vite** - Build tool
- **Axios** - HTTP client
- **Google Maps JavaScript API** - แสดงแผนที่

## 📦 ความต้องการของระบบ

- **Java 17** หรือสูงกว่า
- **Node.js 18** หรือสูงกว่า
- **PostgreSQL 12** หรือสูงกว่า
- **Maven 3.6** หรือสูงกว่า
- **npm** หรือ **yarn**

## 🚀 การติดตั้ง

### 1. Clone repository

```bash
git clone <repository-url>
cd Travel-App
```

### 2. ติดตั้ง Backend Dependencies

```bash
cd backend
mvn clean install
```

### 3. ติดตั้ง Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. ตั้งค่าฐานข้อมูล

สร้างฐานข้อมูล PostgreSQL:

```sql
CREATE DATABASE travelapp;
```

รัน schema:

```bash
psql -U postgres -d travelapp -f database/schema.sql
```

## ⚙️ การตั้งค่า

### Backend Configuration

สร้างไฟล์ `backend/src/main/resources/application-local.properties` จาก `application-local.properties.example`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/travelapp
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT Secret (ควรเปลี่ยนใน production)
jwt.secret=your-secret-key-here

# CORS
spring.web.cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration

ตั้งค่า API endpoint ใน `frontend/src/services/api.js` (ถ้าจำเป็น):

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Google Maps API

1. สร้าง Google Maps API Key จาก [Google Cloud Console](https://console.cloud.google.com/)
2. เปิดใช้งาน Maps JavaScript API
3. ตั้งค่า API Key ใน frontend (ตามที่ใช้ในโค้ด)

## 🏃 การรันแอปพลิเคชัน

### รัน Backend

```bash
cd backend
mvn spring-boot:run
```

Backend จะรันที่ `http://localhost:8080`

### รัน Frontend

```bash
cd frontend
npm run dev
```

Frontend จะรันที่ `http://localhost:5173`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/auth/login` - เข้าสู่ระบบ

### Trips

- `GET /api/trips` - ดึงรายการทริปทั้งหมด (รองรับ pagination และ search)
  - Query parameters: `page`, `size`, `query`
- `GET /api/trips/mine` - ดึงทริปของฉัน (ต้อง authenticated)
  - Query parameters: `page`, `size`
- `GET /api/trips/{id}` - ดึงข้อมูลทริปตาม ID
- `POST /api/trips` - สร้างทริปใหม่ (ต้อง authenticated)
- `PUT /api/trips/{id}` - แก้ไขทริป (ต้อง authenticated, เฉพาะเจ้าของทริป)
- `DELETE /api/trips/{id}` - ลบทริป (ต้อง authenticated, เฉพาะเจ้าของทริป)

### Request/Response Examples

#### Register
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

#### Create Trip
```json
POST /api/trips
{
  "title": "เที่ยวเชียงใหม่",
  "description": "ทริปเที่ยวเชียงใหม่ 3 วัน 2 คืน",
  "photos": ["url1", "url2"],
  "tags": ["ธรรมชาติ", "วัฒนธรรม"],
  "latitude": 18.7883,
  "longitude": 98.9853
}
```

## 📁 โครงสร้างโปรเจกต์

```
Travel-App/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/travelapp/
│   │       │   ├── config/         # Configuration classes
│   │       │   ├── controller/     # REST Controllers
│   │       │   ├── dto/            # Data Transfer Objects
│   │       │   ├── entity/         # JPA Entities
│   │       │   ├── repository/     # JPA Repositories
│   │       │   ├── security/       # Security components
│   │       │   ├── service/        # Business logic
│   │       │   └── util/           # Utility classes
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/               # Vue.js Frontend
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS files
│   │   └── utils/          # Utility functions
│   └── package.json
├── database/
│   └── schema.sql          # Database schema
└── Dockerfile              # Docker configuration
```

## 🐳 การใช้งาน Docker

### Build Docker Image

```bash
docker build -t travel-app-backend .
```

### Run Docker Container

```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/travelapp \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  travel-app-backend
```

## 🔒 Security

- ใช้ JWT สำหรับการยืนยันตัวตน
- รหัสผ่านถูก hash ด้วย BCrypt
- CORS ถูกตั้งค่าให้รองรับเฉพาะ origin ที่กำหนด
- API endpoints ที่ต้องการ authentication จะต้องส่ง JWT token ใน header: `Authorization: Bearer <token>`

## 🚀 Production Deployment

### Quick Deploy (Vercel + Render)

สำหรับการ deploy ไปยัง **Vercel (Frontend)** และ **Render (Backend)** ดูที่ [DEPLOY_VERCEL_RENDER.md](./DEPLOY_VERCEL_RENDER.md)

### General Deployment Guide

สำหรับการ deploy แบบทั่วไป ดูที่ [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Checklist

- [ ] ตั้งค่า `JWT_SECRET` (อย่างน้อย 32 ตัวอักษร)
- [ ] ตั้งค่า `CORS_ALLOWED_ORIGINS`
- [ ] ตั้งค่า database credentials
- [ ] ปิด SQL logging (`spring.jpa.show-sql=false`)
- [ ] ตั้งค่า HTTPS/SSL
- [ ] ใช้ production profile (`SPRING_PROFILES_ACTIVE=production`)

### Environment Variables

**Backend:**
- `JWT_SECRET` - JWT secret key (required, min 32 chars)
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins (comma-separated)
- `SPRING_DATASOURCE_URL` - Database connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password

**Frontend:**
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key

ดูรายละเอียดเพิ่มเติมใน [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 License

MIT License

## 👥 Contributors

- lalinyuuu

