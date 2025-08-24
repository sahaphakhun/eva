# การแก้ไขปัญหาการรีซ้ำของหน้าล็อกอินแอดมิน

## ปัญหาที่พบ
หน้าล็อกอินแอดมินมีการรีซ้ำ (redirect loop) เนื่องจากเงื่อนไขการตรวจจับ token ที่ไม่เหมาะสม ทำให้ไม่สามารถกรอกรหัสล็อกอินได้

## สาเหตุของปัญหา
1. **การตรวจสอบ token ในหน้า login**: หน้า `admin-login.html` ตรวจสอบ token ทุกครั้งที่โหลดหน้า และ redirect ไป `/admin` หากมี token
2. **Middleware ไม่รองรับ Authorization header**: ฟังก์ชัน `requireAdminAuthHTML` ใน `middleware.js` รับ token จาก query parameter หรือ cookies เท่านั้น
3. **การ redirect loop**: เมื่อไม่มี token หรือ token ไม่ถูกต้อง ระบบ redirect ไป `/admin-login` แต่หน้า login เองก็ redirect กลับไป `/admin` อีก

## การแก้ไขที่ทำ

### 1. ปรับปรุงหน้า `admin-login.html`
- เพิ่มการตรวจสอบ token ที่ดีขึ้น โดยเรียก API เพื่อยืนยันว่า token ยังใช้งานได้
- หาก token ไม่ถูกต้องหรือหมดอายุ จะลบออกจาก localStorage
- ป้องกันการ redirect loop โดยไม่ redirect ไป `/admin` หาก token ไม่ถูกต้อง

### 2. ปรับปรุง `middleware.js`
- แก้ไขฟังก์ชัน `requireAdminAuthHTML` ให้รับ token จาก Authorization header ได้
- รองรับการส่ง token ในรูปแบบ `Bearer <token>`

### 3. ปรับปรุงหน้า `admin-dashboard.html`
- เพิ่มฟังก์ชัน `checkAuth()` ที่ตรวจสอบ token ก่อนโหลดข้อมูล
- ปรับปรุงการจัดการ error ในทุกฟังก์ชันที่เรียก API
- เพิ่มการลบ token และ redirect ไปหน้า login เมื่อเกิด error
- ป้องกันการเรียก API โดยไม่มีการยืนยันตัวตน

### 4. สร้างหน้าทดสอบ
- สร้างไฟล์ `test-admin-auth.html` เพื่อทดสอบระบบ authentication
- เพิ่ม route `/test-admin-auth` ใน `server.js`

## วิธีการทำงานใหม่

### การเข้าสู่ระบบ
1. ผู้ใช้เข้าสู่หน้า `/admin-login`
2. กรอกรหัสผ่าน (รหัสผ่าน: `Eva999`)
3. ระบบสร้าง JWT token และบันทึกลง localStorage
4. Redirect ไปหน้า `/admin`

### การตรวจสอบสิทธิ์
1. ทุกครั้งที่เข้าหน้า `/admin` จะมีการตรวจสอบ token
2. หากไม่มี token จะ redirect ไป `/admin-login`
3. หากมี token แต่ไม่ถูกต้องหรือหมดอายุ จะลบ token และ redirect ไป `/admin-login`

### การจัดการ Error
1. เมื่อเกิด 401 Unauthorized จะลบ token และ redirect ไปหน้า login
2. เมื่อเกิดข้อผิดพลาดในการเชื่อมต่อ จะลบ token และ redirect ไปหน้า login
3. ป้องกันการ redirect loop โดยการลบ token ที่ไม่ถูกต้อง

## การทดสอบ

### 1. ทดสอบการเข้าสู่ระบบ
```
http://localhost:3000/test-admin-auth
```

### 2. ทดสอบการเข้าถึงหน้าแอดมิน
```
http://localhost:3000/admin-login
http://localhost:3000/admin
```

### 3. ทดสอบ API
- `POST /api/admin/login` - เข้าสู่ระบบ
- `GET /api/statistics` - ดึงข้อมูลสถิติ (ต้องมี token)
- `GET /api/registrations` - ดึงข้อมูลลงทะเบียน (ต้องมี token)

## ความปลอดภัย
- ใช้ JWT token ที่มีอายุ 24 ชั่วโมง
- Token ถูกส่งผ่าน Authorization header
- มีการตรวจสอบ token ทุกครั้งที่เรียก API
- ป้องกันการเข้าถึงหน้าแอดมินโดยไม่ได้รับอนุญาต

## หมายเหตุ
- รหัสผ่านแอดมิน: `Eva999`
- Token หมดอายุหลังจาก 24 ชั่วโมง
- ควรเปลี่ยนรหัสผ่านและ JWT_SECRET ในระบบจริง
- ควรใช้ HTTPS ในระบบจริง
