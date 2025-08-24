# การ Deploy ระบบฟอร์มลงทะเบียน EVA Cloud บน Railway

## ขั้นตอนการ Deploy

### 1. เตรียม MongoDB Database

1. เข้าไปที่ [Railway Dashboard](https://railway.app/)
2. สร้าง New Project
3. เลือก "Add Database" → "MongoDB"
4. รอให้ Database สร้างเสร็จ
5. คัดลอก Connection String จาก "Connect" tab

### 2. ตั้งค่า Environment Variables

ใน Railway Project ของคุณ:

1. ไปที่ "Variables" tab
2. เพิ่ม Environment Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eva-cloud?retryWrites=true&w=majority
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-app-name.railway.app
```

**หมายเหตุ**: แทนที่ `MONGODB_URI` ด้วย Connection String ที่ได้จาก MongoDB Database

### 3. Deploy โปรเจค

1. ใน Railway Project เลือก "Deploy from GitHub repo"
2. เลือก Repository ที่มีโค้ดระบบฟอร์ม
3. Railway จะ Deploy โปรเจคโดยอัตโนมัติ
4. รอให้ Deploy เสร็จสิ้น

### 4. ตรวจสอบการทำงาน

1. ไปที่ "Deployments" tab
2. คลิกที่ URL ที่ได้จาก Railway
3. ทดสอบระบบ:
   - หน้าฟอร์มลงทะเบียน: `/eva-registration`
   - หน้าจัดการข้อมูล: `/admin`
   - API endpoints: `/api/register`, `/api/registrations`

## การตั้งค่า Domain (ไม่บังคับ)

1. ไปที่ "Settings" tab
2. ในส่วน "Domains" คลิก "Generate Domain"
3. หรือเพิ่ม Custom Domain ของคุณ

## การอัปเดตระบบ

เมื่อมีการเปลี่ยนแปลงโค้ด:

1. Push โค้ดใหม่ไปยัง GitHub
2. Railway จะ Deploy อัตโนมัติ
3. หรือคลิก "Redeploy" ใน Railway Dashboard

## การตรวจสอบ Logs

1. ไปที่ "Deployments" tab
2. คลิกที่ Deployment ล่าสุด
3. ดู Logs เพื่อตรวจสอบการทำงาน

## การแก้ไขปัญหา

### MongoDB ไม่เชื่อมต่อ
- ตรวจสอบ `MONGODB_URI` ใน Environment Variables
- ตรวจสอบ Network Access ใน MongoDB
- ตรวจสอบ Database Name

### ระบบไม่ทำงาน
- ตรวจสอบ Logs ใน Railway
- ตรวจสอบ Environment Variables
- ตรวจสอบ Port configuration

### ฟอร์มไม่ส่งข้อมูล
- ตรวจสอบ CORS settings
- ตรวจสอบ API endpoints
- ตรวจสอบ MongoDB connection

## การ Monitor ระบบ

1. **Health Check**: `/health` endpoint
2. **MongoDB Status**: ตรวจสอบใน Railway Dashboard
3. **Performance**: ดู Metrics ใน Railway

## การ Backup ข้อมูล

1. ไปที่ MongoDB Database ใน Railway
2. ใช้ MongoDB Compass หรือ mongoexport
3. Export ข้อมูลเป็น JSON หรือ CSV

## การ Scale ระบบ

1. **Vertical Scaling**: เพิ่ม RAM/CPU ใน Railway
2. **Horizontal Scaling**: เพิ่ม instances
3. **Database Scaling**: ใช้ MongoDB Atlas

## ต้นทุนการใช้งาน

- **Railway**: เริ่มต้นฟรี (500 hours/month)
- **MongoDB**: เริ่มต้นฟรี (512MB storage)
- **Custom Domain**: ฟรี (Railway subdomain)

## การสนับสนุน

หากมีปัญหาการ Deploy:
1. ตรวจสอบ Railway Documentation
2. ดู Logs และ Error Messages
3. ติดต่อ Railway Support

---

**หมายเหตุ**: ระบบนี้ได้รับการออกแบบให้ทำงานบน Railway ได้อย่างมีประสิทธิภาพ
