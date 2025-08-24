# ระบบฟอร์มลงทะเบียน EVA Cloud

ระบบฟอร์มลงทะเบียนออนไลน์สำหรับ EVA Cloud ที่พัฒนาด้วย Node.js, Express และ MongoDB

## คุณสมบัติ

### หน้าฟอร์มลงทะเบียน (`/eva-registration`)
- ฟอร์มลงทะเบียนที่สวยงามและใช้งานง่าย
- ฟิลด์ข้อมูลครบถ้วนตามความต้องการ
- การตรวจสอบข้อมูลแบบ Real-time
- การแสดงข้อความสำเร็จ/ข้อผิดพลาด
- Responsive design สำหรับทุกอุปกรณ์

### หน้าจัดการข้อมูล (`/admin`)
- Dashboard แสดงสถิติการลงทะเบียน
- ตารางแสดงข้อมูลลงทะเบียนทั้งหมด
- ระบบค้นหาและกรองข้อมูล
- การอัปเดตสถานะการติดต่อ
- การส่งออกข้อมูลเป็น CSV
- ระบบ Pagination

## การติดตั้ง

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` จาก `env.example`:
```bash
cp env.example .env
```

แก้ไขไฟล์ `.env`:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/eva-cloud
# สำหรับ Railway ให้ใช้ MONGODB_URI ที่ได้จาก Railway dashboard

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. รันเซิร์ฟเวอร์
```bash
npm start
```

## การใช้งาน

### การเข้าถึงหน้าเว็บ
- **หน้าฟอร์มลงทะเบียน**: `http://localhost:3000/eva-registration`
- **หน้าจัดการข้อมูล**: `http://localhost:3000/admin`
- **หน้าหลัก**: `http://localhost:3000`

### การใช้งาน MongoDB บน Railway

1. สร้าง MongoDB Database บน Railway
2. คัดลอก Connection String
3. ตั้งค่า Environment Variable `MONGODB_URI` บน Railway
4. Deploy โปรเจค

## โครงสร้างฐานข้อมูล

### Collection: `registrations`

```javascript
{
  _id: ObjectId,
  title: String,           // คำนำหน้าชื่อ
  fullName: String,        // ชื่อ-นามสกุล
  position: String,        // ตำแหน่ง
  phone: String,           // เบอร์โทร
  lineId: String,          // ID Line
  email: String,           // อีเมล (unique)
  companyName: String,     // ชื่อบริษัท
  companyLocation: String, // สถานที่ตั้งบริษัท
  aluminumBrands: String,  // แบรนด์อลูมิเนียม
  status: String,          // สถานะ (pending, contacted, demo_scheduled)
  notes: String,           // หมายเหตุ
  createdAt: Date,         // วันที่ลงทะเบียน
  updatedAt: Date          // วันที่อัปเดตล่าสุด
}
```

## API Endpoints

### POST `/api/register`
ลงทะเบียนผู้ใช้ใหม่
```javascript
{
  "title": "นาย",
  "fullName": "สมชาย ใจดี",
  "position": "เจ้าของ",
  "phone": "0812345678",
  "lineId": "somchai123",
  "email": "somchai@example.com",
  "companyName": "บริษัท หน้าต่างดี จำกัด",
  "companyLocation": "กรุงเทพมหานคร",
  "aluminumBrands": "AIS, Aluplast"
}
```

### GET `/api/registrations`
ดึงข้อมูลลงทะเบียนทั้งหมด

### PUT `/api/registrations/:id/status`
อัปเดตสถานะการลงทะเบียน
```javascript
{
  "status": "contacted",
  "notes": "ติดต่อแล้ว กำลังนัดเดโม"
}
```

### GET `/api/statistics`
ดึงสถิติการลงทะเบียน

## การปรับแต่ง

### การเปลี่ยนธีมสี
แก้ไข CSS variables ในไฟล์ HTML:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --warning-color: #fd7e14;
  --danger-color: #dc3545;
}
```

### การเพิ่มฟิลด์ใหม่
1. เพิ่มฟิลด์ในฟอร์ม HTML
2. อัปเดต API endpoint
3. เพิ่มฟิลด์ในฐานข้อมูล
4. อัปเดต Admin dashboard

## การรักษาความปลอดภัย

- การตรวจสอบข้อมูล Input
- การป้องกัน SQL Injection
- การตรวจสอบ Email ซ้ำ
- การใช้ HTTPS ใน Production
- การจำกัดการเข้าถึง Admin dashboard

## การ Deploy บน Railway

1. Push โค้ดไปยัง Git repository
2. เชื่อมต่อ Railway กับ Git repository
3. ตั้งค่า Environment Variables
4. Deploy โปรเจค

## การแก้ไขปัญหา

### MongoDB ไม่เชื่อมต่อ
- ตรวจสอบ Connection String
- ตรวจสอบ Network Access
- ตรวจสอบ Database Name

### ฟอร์มไม่ส่งข้อมูล
- ตรวจสอบ Console errors
- ตรวจสอบ API endpoint
- ตรวจสอบ CORS settings

### Admin dashboard ไม่แสดงข้อมูล
- ตรวจสอบ MongoDB connection
- ตรวจสอบ API responses
- ตรวจสอบ JavaScript errors

## การสนับสนุน

หากมีปัญหาหรือคำถาม กรุณาติดต่อทีมพัฒนา EVA Cloud

---

**หมายเหตุ**: ระบบนี้พัฒนาขึ้นเพื่อการใช้งานภายในของ EVA Cloud เท่านั้น
