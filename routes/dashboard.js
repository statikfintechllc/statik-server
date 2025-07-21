const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Serve dashboard
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/index.html'));
});

// API endpoints
router.get('/api/status', (req, res) => {
    res.json({
        vscode: { status: 'running', port: 8080 },
        https: { enabled: true },
        uptime: process.uptime()
    });
});







module.exports = router;
