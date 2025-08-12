# EvA Cloud Website - Railway Deployment Guide

## ภาพรวม
เว็บไซต์ EvA Cloud เป็นเว็บไซต์สถิตที่สร้างด้วย HTML, CSS และ JavaScript สำหรับโปรแกรมซอฟต์แวร์หน้าต่างและประตู

## การเตรียมโปรเจ็กสำหรับ Railway

### ไฟล์ที่เพิ่มเข้ามา:
1. **package.json** - กำหนดค่าข้อมูลโปรเจ็กและ dependencies
2. **server.js** - Express server สำหรับ serve ไฟล์สถิต
3. **railway.json** - ไฟล์กำหนดค่า Railway
4. **Procfile** - ไฟล์กำหนดค่า process สำหรับ Railway
5. **.nvmrc** - กำหนดเวอร์ชัน Node.js

### Dependencies ที่ใช้:
- `express` - Web server framework
- `compression` - สำหรับบีบอัดไฟล์เพื่อเพิ่มประสิทธิภาพ

## การ Deploy บน Railway

### วิธีที่ 1: ใช้ Railway CLI

1. ติดตั้ง Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login เข้า Railway:
```bash
railway login
```

3. สร้างโปรเจ็กใหม่:
```bash
railway init
```

4. Deploy โปรเจ็ก:
```bash
railway up
```

### วิธีที่ 2: ใช้ GitHub Integration

1. Push โค้ดไปยัง GitHub repository
2. ไปที่ [Railway Dashboard](https://railway.app/dashboard)
3. คลิก "New Project"
4. เลือก "Deploy from GitHub repo"
5. เลือก repository ที่ต้องการ
6. Railway จะ build และ deploy อัตโนมัติ

## การตั้งค่า Environment Variables

Railway จะตั้งค่า `PORT` ให้อัตโนมัติ แต่คุณสามารถเพิ่ม environment variables อื่นๆ ได้:

1. ไปที่ Railway Dashboard
2. เลือกโปรเจ็ก
3. ไปที่แท็บ "Variables"
4. เพิ่ม variables ที่ต้องการ

## การตรวจสอบการ Deploy

1. ตรวจสอบ logs ใน Railway Dashboard
2. ตรวจสอบ health check ที่ endpoint `/`
3. ตรวจสอบ URL ที่ Railway ให้มา

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย:

1. **Build fails** - ตรวจสอบ package.json และ dependencies
2. **Port issues** - ตรวจสอบการใช้ `process.env.PORT`
3. **Static files not loading** - ตรวจสอบ path ใน server.js

### การ Debug:

```bash
# ดู logs
railway logs

# ดูสถานะ deployment
railway status

# Restart service
railway service restart
```

## การอัปเดตเว็บไซต์

1. แก้ไขไฟล์ที่ต้องการ
2. Commit และ push ไปยัง GitHub
3. Railway จะ deploy อัตโนมัติ (หากใช้ GitHub integration)
4. หรือใช้ `railway up` เพื่อ deploy ใหม่

## การตั้งค่า Custom Domain

1. ไปที่ Railway Dashboard
2. เลือกโปรเจ็ก
3. ไปที่แท็บ "Settings"
4. เพิ่ม custom domain
5. ตั้งค่า DNS records ตามที่ Railway แนะนำ

## การ Monitor และ Analytics

Railway มี built-in monitoring:
- Request logs
- Error tracking
- Performance metrics
- Resource usage

## การ Backup

Railway จะ backup โค้ดอัตโนมัติผ่าน Git แต่แนะนำให้:
- เก็บ backup ของไฟล์สำคัญ
- ใช้ environment variables สำหรับข้อมูลที่สำคัญ
- ตั้งค่า automatic backups หากเป็นข้อมูลที่สำคัญ

## การ Scale

Railway รองรับการ scale อัตโนมัติ:
- เพิ่ม instances ตาม demand
- ตั้งค่า resource limits
- ใช้ CDN สำหรับ static assets

---

## สรุป

โปรเจ็ก EvA Cloud พร้อมสำหรับการ deploy บน Railway แล้ว! ไฟล์ที่จำเป็นทั้งหมดได้ถูกสร้างขึ้นแล้ว และเว็บไซต์จะทำงานได้อย่างสมบูรณ์บน Railway platform.
