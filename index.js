require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(express.static('frontend'));

// CONFIG EMAIL
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// PAGES
app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'frontend/jahili.html')));
app.get('/verifier', (req,res) => res.sendFile(path.join(__dirname, 'frontend/verifier.html')));
app.get('/signal', (req,res) => res.sendFile(path.join(__dirname, 'frontend/signal.html')));
app.get('/support', (req,res) => res.sendFile(path.join(__dirname, 'frontend/support.html')));

// API
app.get('/api/check', (req,res) => res.json({signale:false, nb:0}));
app.post('/api/signal', async (req,res) => {
  const {numero, preuve} = req.body;
  await transporter.sendMail({
    from: 'VORAX-USER',
    to: 'Support@support.whatsapp.com',
    subject: `🚨 Signalement: ${numero}`,
    text: `Numéro: ${numero}\nPreuve: ${preuve}`
  });
  res.json({ok:true});
});

// LIGNE POUR RENDER ICI 👇
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('VORAX-USER lancé sur le port', PORT));
