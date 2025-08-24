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
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('registrations').insertOne(registration);
        
        res.status(201).json({
            message: 'ลงทะเบียนสำเร็จ',
            id: result.insertedId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
});

// Get all registrations
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

// Update registration status
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

// Get statistics
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
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงสถิติ' });
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
