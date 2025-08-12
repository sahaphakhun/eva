# การใช้งานฟอนต์ไทยใน EvA Cloud

## ภาพรวม

โปรเจค EvA Cloud ได้รับการปรับปรุงให้รองรับฟอนต์ไทยที่สวยงามและอ่านง่าย โดยใช้ฟอนต์หลัก 2 แบบ:

1. **Noto Sans Thai** - ฟอนต์หลักที่ออกแบบมาเพื่อรองรับภาษาไทยโดยเฉพาะ
2. **Sarabun** - ฟอนต์รองที่มีลักษณะสวยงามและอ่านง่าย
3. **Poppins** - ฟอนต์ภาษาอังกฤษที่เป็น fallback

## ฟอนต์ที่ใช้

### Noto Sans Thai
- **แหล่งที่มา**: Google Fonts
- **น้ำหนัก**: 100-900 (9 ระดับ)
- **ลักษณะ**: ออกแบบมาเพื่อรองรับภาษาไทยโดยเฉพาะ มีความสวยงามและอ่านง่าย
- **เหมาะสำหรับ**: หัวข้อ, ข้อความสำคัญ, UI elements

### Sarabun
- **แหล่งที่มา**: Google Fonts  
- **น้ำหนัก**: 100-800 (8 ระดับ)
- **ลักษณะ**: ฟอนต์ไทยที่มีลักษณะคลาสสิก อ่านง่าย
- **เหมาะสำหรับ**: เนื้อหาหลัก, ข้อความยาว

### Poppins
- **แหล่งที่มา**: Google Fonts
- **น้ำหนัก**: 300-700 (5 ระดับ)
- **ลักษณะ**: ฟอนต์ภาษาอังกฤษที่ทันสมัย
- **เหมาะสำหรับ**: Fallback เมื่อฟอนต์ไทยไม่สามารถโหลดได้

## การใช้งาน

### CSS Classes ที่มีให้

#### หัวข้อ (Headings)
```css
.thai-heading-1    /* ขนาดใหญ่สุด - 3rem */
.thai-heading-2    /* ขนาดใหญ่ - 2.25rem */
.thai-heading-3    /* ขนาดกลาง-ใหญ่ - 1.875rem */
.thai-heading-4    /* ขนาดกลาง - 1.5rem */
.thai-heading-5    /* ขนาดกลาง-เล็ก - 1.25rem */
.thai-heading-6    /* ขนาดเล็ก - 1.125rem */
```

#### ข้อความ (Body Text)
```css
.thai-body         /* ขนาดปกติ - 1rem */
.thai-body-large   /* ขนาดใหญ่ - 1.125rem */
.thai-body-small   /* ขนาดเล็ก - 0.875rem */
```

#### ขนาดข้อความ (Text Sizes)
```css
.thai-text-xs      /* 0.75rem */
.thai-text-sm      /* 0.875rem */
.thai-text-base    /* 1rem */
.thai-text-lg      /* 1.125rem */
.thai-text-xl      /* 1.25rem */
.thai-text-2xl     /* 1.5rem */
.thai-text-3xl     /* 1.875rem */
.thai-text-4xl     /* 2.25rem */
.thai-text-5xl     /* 3rem */
```

#### น้ำหนักฟอนต์ (Font Weights)
```css
.thai-light        /* 300 */
.thai-normal       /* 400 */
.thai-medium       /* 500 */
.thai-semibold     /* 600 */
.thai-bold         /* 700 */
.thai-extrabold    /* 800 */
```

#### UI Elements
```css
.thai-button       /* สำหรับปุ่ม */
.thai-input        /* สำหรับ input fields */
.thai-label        /* สำหรับ labels */
.thai-nav          /* สำหรับ navigation */
.thai-footer       /* สำหรับ footer */
```

### ตัวอย่างการใช้งาน

#### HTML
```html
<h1 class="thai-heading-1 thai-bold">หัวข้อหลัก</h1>
<h2 class="thai-heading-2 thai-semibold">หัวข้อรอง</h2>
<p class="thai-body thai-normal">เนื้อหาข้อความปกติ</p>
<button class="thai-button thai-medium">ปุ่มกด</button>
```

#### CSS
```css
.custom-heading {
    font-family: var(--thai-font-primary);
    font-weight: 700;
    line-height: 1.2;
}

.custom-text {
    font-family: var(--thai-font-primary), var(--thai-font-secondary);
    line-height: 1.8;
}
```

## CSS Variables

### Font Family Variables
```css
:root {
    --thai-font-primary: 'Noto Sans Thai', sans-serif;
    --thai-font-secondary: 'Sarabun', sans-serif;
    --thai-font-fallback: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### การใช้งานใน CSS
```css
.my-element {
    font-family: var(--thai-font-primary), var(--thai-font-secondary), var(--thai-font-fallback);
}
```

## การโหลดฟอนต์

### Font Loading API
ระบบจะใช้ Font Loading API (ถ้าเบราว์เซอร์รองรับ) เพื่อจัดการการโหลดฟอนต์อย่างมีประสิทธิภาพ

### Fallback System
หากฟอนต์ไทยไม่สามารถโหลดได้ ระบบจะใช้ฟอนต์ fallback โดยอัตโนมัติ

### Loading States
```css
.thai-font-loading  /* สถานะกำลังโหลดฟอนต์ */
.thai-font-loaded   /* สถานะโหลดฟอนต์เสร็จแล้ว */
```

## JavaScript API

### ThaiFontLoader Class
```javascript
// ตรวจสอบว่าฟอนต์โหลดแล้วหรือไม่
if (window.thaiFontLoader.isFontLoaded('Noto Sans Thai')) {
    console.log('Noto Sans Thai loaded');
}

// รับรายการฟอนต์ที่โหลดแล้ว
const loadedFonts = window.thaiFontLoader.getLoadedFonts();

// รับ event เมื่อฟอนต์โหลดเสร็จ
document.addEventListener('thaiFontsLoaded', (event) => {
    console.log('Fonts loaded:', event.detail.loadedFonts);
});
```

## การปรับแต่ง

### เพิ่มฟอนต์ใหม่
1. เพิ่มฟอนต์ใน Google Fonts import
2. เพิ่มชื่อฟอนต์ใน `ThaiFontLoader` class
3. เพิ่ม CSS variables ใหม่

### เปลี่ยนฟอนต์หลัก
แก้ไข CSS variable `--thai-font-primary` ในไฟล์ `thai-fonts.css`

## ประสิทธิภาพ

### Font Display
- ใช้ `font-display: swap` เพื่อแสดงข้อความทันที
- Fallback fonts จะแสดงจนกว่าฟอนต์ไทยจะโหลดเสร็จ

### Preloading
ฟอนต์จะถูกโหลดแบบ async เพื่อไม่ให้บล็อกการแสดงผลหน้าเว็บ

### Caching
ฟอนต์จะถูก cache โดยเบราว์เซอร์เพื่อการโหลดที่เร็วขึ้นในครั้งต่อไป

## การทดสอบ

### ตรวจสอบฟอนต์
```javascript
// เปิด Console ในเบราว์เซอร์
console.log(window.thaiFontLoader.getLoadedFonts());
```

### ตรวจสอบ CSS Classes
ตรวจสอบว่า CSS classes ต่างๆ ทำงานถูกต้องใน Developer Tools

## การแก้ไขปัญหา

### ฟอนต์ไม่แสดง
1. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
2. ตรวจสอบ Console สำหรับ error messages
3. ตรวจสอบว่า Google Fonts สามารถเข้าถึงได้

### ฟอนต์แสดงช้า
1. ตรวจสอบความเร็วอินเทอร์เน็ต
2. ใช้ Font Loading API (เบราว์เซอร์ใหม่)
3. ตรวจสอบการ cache ของเบราว์เซอร์

## หมายเหตุ

- ฟอนต์จะถูกโหลดแบบ async เพื่อไม่ให้บล็อกการแสดงผล
- ระบบ fallback จะทำงานอัตโนมัติหากฟอนต์ไทยไม่สามารถโหลดได้
- CSS classes ทั้งหมดรองรับ responsive design
- ฟอนต์ได้รับการปรับแต่งเพื่อการแสดงผลที่สวยงามบนทุกอุปกรณ์
