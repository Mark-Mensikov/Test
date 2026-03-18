const express = require('express');
const path = require('path');

const app = express();

// Было: const PORT = process.env.PORT || 3000;
// Стало:
const PORT = parseInt(process.env.PORT, 10) || 3000;

// Раздаём статические файлы (index.html)
app.use(express.static(__dirname));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check остаётся
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Rakendus tootab!',
    uptime: process.uptime()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server tootab pordi ${PORT} peal`);
});
