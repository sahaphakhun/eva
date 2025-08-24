// Middleware สำหรับตรวจสอบการเข้าถึงแอดมิน
const jwt = require('jsonwebtoken');

// รหัสผ่านแอดมิน (ในระบบจริงควรเก็บใน environment variables)
const ADMIN_PASSWORD = 'Eva999';
const JWT_SECRET = 'eva-cloud-admin-secret-key-2024';

// ตรวจสอบรหัสผ่านแอดมิน
function verifyAdminPassword(password) {
    return password === ADMIN_PASSWORD;
}

// สร้าง JWT token
function generateAdminToken() {
    return jwt.sign(
        { 
            role: 'admin', 
            timestamp: Date.now() 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
    );
}

// ตรวจสอบ JWT token
function verifyAdminToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.role === 'admin';
    } catch (error) {
        return false;
    }
}

// Middleware สำหรับตรวจสอบการเข้าถึงแอดมิน
function requireAdminAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.query.token || 
                  req.cookies?.adminToken;

    if (!token) {
        return res.status(401).json({ 
            message: 'ไม่มีการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่',
            redirect: '/admin-login'
        });
    }

    if (!verifyAdminToken(token)) {
        return res.status(401).json({ 
            message: 'Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่',
            redirect: '/admin-login'
        });
    }

    next();
}

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

module.exports = {
    verifyAdminPassword,
    generateAdminToken,
    verifyAdminToken,
    requireAdminAuth,
    requireAdminAuthHTML,
    JWT_SECRET
};
