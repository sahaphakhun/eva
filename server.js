const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression for better performance
app.use(compression());

// Serve static files
app.use(express.static(__dirname));

// Handle all routes by serving index.html (for SPA-like behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`EvA Cloud website is running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
