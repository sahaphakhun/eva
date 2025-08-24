// Configuration file for EVA Cloud Registration System
module.exports = {
    // MongoDB Connection
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/eva-cloud',
    
    // Server Configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // CORS Configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    
    // Database Configuration
    DB_NAME: 'eva-cloud',
    COLLECTION_NAME: 'registrations'
};
