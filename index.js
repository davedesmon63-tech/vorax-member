const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(express.static('frontend'));

// CONFIG EMAIL - REMPLACE AVEC TON GMAIL
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: 'tonemail@gmail.com', // TON GMAIL
    pass: 'tonmotdepasseapp' // MOT DE PASSE D'APPLICATION GMAIL
  }
});

// PAGES
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'frontend/jahili.html'));
});

app.get('/verifier', (req,res) => {
  res.sendFile(path.join(__dirname, 'frontend/verifier.html'));
});

app.get('/signal', (req,res) => {
  res.sendFile(path.join(__dirname, 'frontend/signal.html'));
});

app.get('/support', (req,res) => {
  res.sendFile(path.join(__dirname, 'frontend/support.html'));
});

// API VERIFIER - VERSION SANS BASE DE DONNÉES
app.get('/api/check', (req,res) => {
  res.json({signale:false, nb:0, raison:"no report"});
});

// API SIGNALER - send mail
app.post('/api/signal', async (req,res) => {
  const {numero, preuve} = req.body;
  
  try {
    await transporter.sendMail({
      from: 'VORAX-USER',
      to: 'Support@support.whatsapp.com',
      subject: `🚨 report VORAX: ${numero}`,
      text: `new report\n\nNuméro: ${numero}\nDescription: ${preuve}\n\nDate: ${new Date()}`
    });
    res.json({ok:true});
  } catch(e){
    res.json({ok:false, error:e.message});
  }
});

app.listen(3000, () => console.log('VORAX-USER lancé sur http://localhost:3000'));
