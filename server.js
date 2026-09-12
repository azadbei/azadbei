const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const COUNTER_FILE = path.join(__dirname, 'counter.json');

// CORS ruxsatini berish (boshqa domenlardan murojaat qila olishi uchun)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

// Statik fayllarni ulash (index.html, profile.html va rasmlar turgan papka uchun)
app.use(express.static(__dirname));

// Ko'rishlar sonini olish va oshirish API si
app.get('/api/visit', (req, res) => {
  let visits = 1240; // Boshlang'ich baza raqam
  
  if (fs.existsSync(COUNTER_FILE)) {
    try {
      const data = fs.readFileSync(COUNTER_FILE, 'utf8');
      const parsed = JSON.parse(data);
      visits = parsed.visits || visits;
    } catch (e) {
      console.error(e);
    }
  }

  // Har safar murojaat qilinganda bittaga oshiramiz
  visits += 1;

  try {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ visits }));
  } catch (e) {
    console.error(e);
  }

  res.json({ visits });
});

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});