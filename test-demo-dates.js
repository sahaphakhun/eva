// ไฟล์ทดสอบสำหรับเพิ่มข้อมูลวันที่เดโม่
// รันด้วย: node test-demo-dates.js

const { MongoClient } = require('mongodb');

// ใช้ MongoDB URI จาก config หรือ environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eva-cloud';

async function addTestDemoDates() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db();
        
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
        
        // ข้อมูลวันที่เดโม่ทดสอบ
        const testDemoDates = [
            {
                dateText: 'วันที่ 15 ธันวาคม 2567 เวลา 10:00 น.',
                maxCount: 10,
                currentCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                dateText: 'วันที่ 16 ธันวาคม 2567 เวลา 14:00 น.',
                maxCount: 15,
                currentCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                dateText: 'วันที่ 17 ธันวาคม 2567 เวลา 11:00 น.',
                maxCount: 8,
                currentCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        // เพิ่มข้อมูลทดสอบ
        const result = await db.collection('demoDates').insertMany(testDemoDates);
        
        console.log(`เพิ่มข้อมูลวันที่เดโม่ทดสอบสำเร็จ ${result.insertedCount} รายการ`);
        console.log('ID ที่สร้าง:', result.insertedIds);
        
        // ตรวจสอบข้อมูลที่เพิ่ม
        const allDemoDates = await db.collection('demoDates').find({}).toArray();
        console.log('ข้อมูลวันที่เดโม่ทั้งหมด:', allDemoDates);
        
        await client.close();
        console.log('ปิดการเชื่อมต่อฐานข้อมูล');
        
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
    }
}

// รันฟังก์ชัน
addTestDemoDates();
