# EvA Cloud - Window and Door Software

[![Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/your-username/eva-cloud)

## 🌟 ภาพรวม

EvA Cloud เป็นซอฟต์แวร์ที่ทรงพลังสำหรับการผลิตหน้าต่างและประตู ใช้งานโดยแบรนด์ชั้นนำในอุตสาหกรรม ซอฟต์แวร์ครบครันสำหรับผู้ผลิตหน้าต่างและประตู uPVC และอลูมิเนียม

## 🚀 การ Deploy บน Railway

โปรเจ็กนี้พร้อมสำหรับการ deploy บน Railway แล้ว! 

### วิธีที่รวดเร็วที่สุด:

1. คลิกปุ่ม "Deploy on Railway" ด้านบน
2. หรือใช้คำสั่ง:
```bash
npx create-railway-app eva-cloud --template=https://github.com/your-username/eva-cloud
```

### วิธีแบบ Manual:

1. **Clone โปรเจ็ก:**
```bash
git clone https://github.com/your-username/eva-cloud.git
cd eva-cloud
```

2. **ติดตั้ง Dependencies:**
```bash
npm install
```

3. **ทดสอบในเครื่อง:**
```bash
npm start
```

4. **Deploy บน Railway:**
```bash
npm install -g @railway/cli
railway login
railway up
```

## 📁 โครงสร้างโปรเจ็ก

```
eva-cloud/
├── index.html              # หน้าหลัก
├── pages/                  # หน้าต่างๆ
├── assets/                 # ไฟล์ static
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── images/            # รูปภาพ
│   └── fonts/             # ฟอนต์
├── components/            # Components
├── server.js              # Express server
├── package.json           # Dependencies
├── railway.json           # Railway config
└── README-RAILWAY.md      # คู่มือ Railway
```

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Deployment:** Railway
- **Performance:** Compression middleware

## 🔧 การตั้งค่า

### Environment Variables

สร้างไฟล์ `.env` จาก `env.example`:

```bash
cp env.example .env
```

### การพัฒนา

```bash
# ติดตั้ง dependencies
npm install

# รันในโหมด development
npm run dev

# รันในโหมด production
npm start
```

## 📊 Features

- ✅ Responsive Design
- ✅ SEO Optimized
- ✅ Fast Loading
- ✅ Compression Enabled
- ✅ Health Check Endpoint
- ✅ Railway Ready
- ✅ Custom Domain Support

## 🌐 การเข้าถึง

- **หน้าหลัก:** `/`
- **Health Check:** `/health`
- **หน้าต่างๆ:** `/pages/*`

## 📞 การติดต่อ

- **Website:** [evawinoptimize.com](https://evawinoptimize.com)
- **Email:** contact@evawinoptimize.com

## 📄 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 🤝 การมีส่วนร่วม

1. Fork โปรเจ็ก
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

---

**EvA Cloud** - Save Time, Reduce Wastage and Streamline your process with EvA's Windows and Doors Fabrication Software
