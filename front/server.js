const express = require('express');
const path = require('path');
const app = express();
app.use('/front', express.static(path.join(__dirname, 'front')));
// Võtame pordi keskkonnast, aga kui seal on vigane tekst, kasutame 3000
const PORT = parseInt(process.env.PORT, 10) || 3000;

// Sinu PocketBase URL
const PB_URL = 'http://pocketbase-hv4bvovfn86uwdafxs7d7p1s.176.112.158.3.sslip.io';

app.use(express.static(__dirname));

// See on kriitiline: saadame andmebaasi aadressi front-endile
app.get('/config', (req, res) => {
  res.json({ pbUrl: PB_URL });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server töötab pordil ${PORT}`);
  console.log(`PocketBase aadress: ${PB_URL}`);
});
