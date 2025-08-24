const express = require('express');
const path = require('path');
const compression = require('compression');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');

const app = express();
const PORT = config.PORT;

// MongoDB connection
let db;
const MONGODB_URI = config.MONGODB_URI;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db();
        console.log('Connected to MongoDB successfully');
        
        // Create indexes
        await db.collection('registrations').createIndex({ email: 1 }, { unique: true });
        await db.collection('registrations').createIndex({ createdAt: 1 });
        await db.collection('registrations').createIndex({ status: 1 });
        await db.collection('registrations').createIndex({ demoDateId: 1 });
        
        // Create indexes for demo dates
        await db.collection('demoDates').createIndex({ createdAt: 1 });
        await db.collection('demoDates').createIndex({ currentCount: 1 });
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Middleware
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: db ? 'connected' : 'disconnected'
  });
});

// API Routes

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const {
            title,
            fullName,
            position,
            phone,
            lineId,
            email,
            companyName,
            companyLocation,
            aluminumBrands
        } = req.body;

        // Validation
        if (!title || !fullName || !position || !phone || !lineId || !email || !companyName || !companyLocation) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check if email already exists
        const existingRegistration = await db.collection('registrations').findOne({ email });
        if (existingRegistration) {
            return res.status(400).json({ message: 'อีเมลนี้ได้ลงทะเบียนแล้ว' });
        }

        // Check if demo date is selected and validate availability
        let demoDateId = null;
        let demoDateText = '';
        
        if (req.body.demoDateId) {
            const demoDate = await db.collection('demoDates').findOne({
                _id: new require('mongodb').ObjectId(req.body.demoDateId)
            });
            
            if (!demoDate) {
                return res.status(400).json({ message: 'วันที่เดโม่ที่เลือกไม่ถูกต้อง' });
            }
            
            if (demoDate.currentCount >= demoDate.maxCount) {
                return res.status(400).json({ message: 'วันที่เดโม่ที่เลือกเต็มแล้ว กรุณาเลือกวันที่อื่น' });
            }
            
            demoDateId = demoDate._id;
            demoDateText = demoDate.dateText;
        }

        // Create registration
        const registration = {
            title,
            fullName,
            position,
            phone,
            lineId,
            email,
            companyName,
            companyLocation,
            aluminumBrands: aluminumBrands || '',
            demoDateId,
            demoDateText,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('registrations').insertOne(registration);
        
        // Update demo date current count if demo date was selected
        if (demoDateId) {
            await db.collection('demoDates').updateOne(
                { _id: demoDateId },
                { $inc: { currentCount: 1 } }
            );
        }
        
        res.status(201).json({
            message: 'ลงทะเบียนสำเร็จ',
            id: result.insertedId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
});

// Get all registrations (no auth required)
app.get('/api/registrations', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const registrations = await db.collection('registrations')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json(registrations);

    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});

// Update registration status (no auth required)
app.put('/api/registrations/:id/status', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const { id } = req.params;
        const { status, notes } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'กรุณาระบุสถานะ' });
        }

        const result = await db.collection('registrations').updateOne(
            { _id: new require('mongodb').ObjectId(id) },
            {
                $set: {
                    status,
                    notes: notes || '',
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลลงทะเบียน' });
        }

        res.json({ message: 'อัปเดตสถานะสำเร็จ' });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' });
    }
});

// Get statistics (no auth required)
app.get('/api/statistics', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [total, todayCount, thisMonthCount, pendingCount] = await Promise.all([
            db.collection('registrations').countDocuments(),
            db.collection('registrations').countDocuments({ createdAt: { $gte: today } }),
            db.collection('registrations').countDocuments({ createdAt: { $gte: thisMonth } }),
            db.collection('registrations').countDocuments({ status: 'pending' })
        ]);

        res.json({
            total,
            today: todayCount,
            thisMonth: thisMonthCount,
            pending: pendingCount
        });

    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงสถิติ กรุณาลองใหม่อีกครั้ง' });
    }
});

// Demo date management endpoints (no auth required)

// Get all demo date options
app.get('/api/demo-dates', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const demoDates = await db.collection('demoDates').find({}).sort({ createdAt: -1 }).toArray();
        res.json(demoDates);
    } catch (error) {
        console.error('Error fetching demo dates:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลวันที่เดโม่' });
    }
});

// Add new demo date option
app.post('/api/demo-dates', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const { dateText, maxCount } = req.body;

        if (!dateText || !maxCount) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        const demoDate = {
            dateText,
            maxCount: parseInt(maxCount),
            currentCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('demoDates').insertOne(demoDate);
        
        res.status(201).json({
            message: 'เพิ่มวันที่เดโม่สำเร็จ',
            id: result.insertedId,
            demoDate
        });

    } catch (error) {
        console.error('Error adding demo date:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มวันที่เดโม่' });
    }
});

// Update demo date option
app.put('/api/demo-dates/:id', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const { id } = req.params;
        const { dateText, maxCount } = req.body;

        if (!dateText || !dateText.trim()) {
            return res.status(400).json({ message: 'กรุณากรอกข้อความวันที่เดโม่' });
        }

        if (!maxCount || maxCount < 1) {
            return res.status(400).json({ message: 'จำนวนคนสูงสุดต้องมากกว่า 0' });
        }

        const updateData = {
            dateText: dateText.trim(),
            maxCount: parseInt(maxCount),
            updatedAt: new Date()
        };

        const result = await db.collection('demoDates').updateOne(
            { _id: new require('mongodb').ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'ไม่พบวันที่เดโม่ที่ต้องการแก้ไข' });
        }

        res.json({
            message: 'อัปเดตวันที่เดโม่สำเร็จ',
            id: id
        });

    } catch (error) {
        console.error('Error updating demo date:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตวันที่เดโม่' });
    }
});

// Delete demo date option
app.delete('/api/demo-dates/:id', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const { id } = req.params;

        // Check if any registrations are using this demo date
        const registrationsUsingDate = await db.collection('registrations').findOne({
            demoDateId: id
        });

        if (registrationsUsingDate) {
            return res.status(400).json({ 
                message: 'ไม่สามารถลบวันที่เดโม่ได้ เนื่องจากมีผู้ลงทะเบียนใช้อยู่' 
            });
        }

        const result = await db.collection('demoDates').deleteOne({
            _id: new require('mongodb').ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'ไม่พบวันที่เดโม่ที่ต้องการลบ' });
        }

        res.json({
            message: 'ลบวันที่เดโม่สำเร็จ',
            id: id
        });

    } catch (error) {
        console.error('Error deleting demo date:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบวันที่เดโม่' });
    }
});

// Get demo dates for public form (no auth required)
app.get('/api/public/demo-dates', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const demoDates = await db.collection('demoDates').find({}).sort({ createdAt: -1 }).toArray();
        
        // Add availability status for each date
        const demoDatesWithStatus = demoDates.map(date => ({
            ...date,
            isAvailable: date.currentCount < date.maxCount,
            remainingSlots: date.maxCount - date.currentCount
        }));

        res.json(demoDatesWithStatus);
    } catch (error) {
        console.error('Error fetching public demo dates:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลวันที่เดโม่' });
    }
});

// Serve specific HTML files
app.get('/eva-registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'eva-registration.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-registration.html'));
});

// Handle all other routes by serving index.html (for SPA-like behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
async function startServer() {
    await connectToMongoDB();

app.listen(PORT, () => {
  console.log(`EvA Cloud website is running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
        console.log(`Registration form: http://localhost:${PORT}/eva-registration`);
        console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
        console.log(`Test page: http://localhost:${PORT}/test`);
});
}

startServer().catch(console.error);
