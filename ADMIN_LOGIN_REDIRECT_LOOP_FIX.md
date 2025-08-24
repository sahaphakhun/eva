# การแก้ไขปัญหาการรีโหลดซ้ำ ๆ ที่หน้า Admin Login

## ปัญหาที่พบ
1. หน้า https://www.evacloudthai.com/admin-login มีการรีโหลดซ้ำ ๆ จนไม่สามารถล็อกอินได้
2. หลังจากแก้ไขแล้ว พบปัญหา "Access denied - Redirect loop detected" เมื่อเข้าหน้า admin-login

## สาเหตุของปัญหา
1. **Redirect Loop**: การตรวจสอบ token ในหน้า admin-login.html ที่จะพยายาม redirect ไปหน้า `/admin` ถ้า token ยังใช้งานได้
2. **Network Error Handling**: เมื่อเกิด network error ในการตรวจสอบ token ไม่มีการลบ token ออก ทำให้เกิดการตรวจสอบซ้ำ
3. **ไม่มี Timeout**: การเรียก API ไม่มี timeout ทำให้เกิดการรอคอยนานเกินไป
4. **ไม่มีการป้องกันการส่งฟอร์มซ้ำ**: ผู้ใช้สามารถกดปุ่มล็อกอินซ้ำได้
5. **การตรวจสอบ Referer ที่ไม่เหมาะสม**: การตรวจสอบ referer header ใน middleware ทำให้เกิด false positive

## การแก้ไขที่ทำ

### 1. แก้ไขไฟล์ `admin-login.html`

#### เพิ่มการป้องกัน redirect loop:
```javascript
// ป้องกันการตรวจสอบซ้ำ
if (window.tokenCheckInProgress) {
    return;
}

window.tokenCheckInProgress = true;
```

#### เพิ่ม timeout สำหรับการเรียก API:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // timeout 5 วินาที

const response = await fetch('/api/statistics', {
    headers: {
        'Authorization': `Bearer ${token}`
    },
    signal: controller.signal
});
```

#### ลบ token เมื่อเกิด network error:
```javascript
} catch (error) {
    // เกิดข้อผิดพลาดในการเชื่อมต่อ ให้ลบ token เพื่อป้องกัน redirect loop
    console.log('Network error during token validation:', error);
    localStorage.removeItem('adminToken');
} finally {
    window.tokenCheckInProgress = false;
}
```

#### เพิ่มการป้องกันการส่งฟอร์มซ้ำ:
```javascript
// ป้องกันการส่งฟอร์มซ้ำ
if (submitButton.disabled) {
    return;
}

// ปิดปุ่มและแสดงสถานะ loading
submitButton.disabled = true;
submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>กำลังเข้าสู่ระบบ...';
```

#### เพิ่ม timeout สำหรับการล็อกอิน:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // timeout 10 วินาที
```

### 2. แก้ไขไฟล์ `middleware.js`

#### ปรับปรุงการตรวจสอบ authentication:
```javascript
// Middleware สำหรับตรวจสอบการเข้าถึงแอดมินในหน้า HTML
function requireAdminAuthHTML(req, res, next) {
    const token = req.query.token || req.cookies?.adminToken;

    if (!token || !verifyAdminToken(token)) {
        // ป้องกัน redirect loop โดยตรวจสอบว่า request มาจากหน้าไหน
        if (req.path === '/admin-login') {
            return res.status(403).send('Access denied');
        }
        
        return res.redirect('/admin-login');
    }

    next();
}
```

**หมายเหตุ**: ลบการตรวจสอบ referer ออกเพราะอาจทำให้เกิดปัญหา "Access denied - Redirect loop detected" โดยไม่จำเป็น

### 3. แก้ไขไฟล์ `server.js`

#### ปรับปรุงข้อความ error:
```javascript
res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง' });
```

## ผลลัพธ์ที่คาดหวัง
1. **ไม่มี redirect loop**: หน้า admin-login จะไม่รีโหลดซ้ำ ๆ อีกต่อไป
2. **การจัดการ error ที่ดีขึ้น**: เมื่อเกิด network error จะลบ token และแสดงข้อความที่เหมาะสม
3. **Timeout protection**: การเรียก API จะมี timeout เพื่อป้องกันการรอคอยนานเกินไป
4. **ป้องกันการส่งฟอร์มซ้ำ**: ผู้ใช้ไม่สามารถกดปุ่มล็อกอินซ้ำได้
5. **UX ที่ดีขึ้น**: แสดงสถานะ loading และข้อความ error ที่ชัดเจน

## วิธีการทดสอบ
1. เข้าไปที่หน้า https://www.evacloudthai.com/admin-login
2. ลองล็อกอินด้วยรหัสผ่านที่ถูกต้อง
3. ตรวจสอบว่าไม่มีการรีโหลดซ้ำ ๆ
4. ลองล็อกอินด้วยรหัสผ่านที่ผิด
5. ตรวจสอบว่าข้อความ error แสดงขึ้นมาและไม่มีการรีโหลด

## หมายเหตุ
- การแก้ไขนี้จะช่วยป้องกันปัญหาการรีโหลดซ้ำ ๆ และปรับปรุงประสบการณ์การใช้งาน
- หากยังมีปัญหาอยู่ กรุณาตรวจสอบ console ของ browser เพื่อดู error messages
- ควรทดสอบในสภาพแวดล้อมต่างๆ เพื่อให้แน่ใจว่าการแก้ไขทำงานได้ดี
