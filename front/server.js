const express = require('express');
const path = require('path');
const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3000;
// Убедитесь, что этот URL ведет на ваш PocketBase в Coolify
const PB_URL = 'http://pocketbase-hv4bvovfn86uwdafxs7d7p1s.176.112.158.3.sslip.io';

app.use(express.static(__dirname));

app.get('/config', (req, res) => {
    res.json({ pbUrl: PB_URL });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
