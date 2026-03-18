const express = require('express');
const path = require('path');

const app = express();

// Порт (теперь защищен от ошибок в окружении)
const PORT = parseInt(process.env.PORT, 10) || 3000;

// URL вашего PocketBase
const PB_URL = process.env.PB_URL || 'http://pocketbase-hv4bvovfn86uwdafxs7d7p1s.176.112.158.3.sslip.io';

app.use(express.static(__dirname));

// Эндпоинт, чтобы фронтенд мог узнать, куда стучаться за данными
app.get('/config', (req, res) => {
  res.json({ pbUrl: PB_URL });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Rakendus tootab!',
    uptime: process.uptime(),
    databaseUrl: PB_URL // Добавили для проверки в логах
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server tootab pordi ${PORT} peal`);
  console.log(`PocketBase подключен по адресу: ${PB_URL}`);
});
