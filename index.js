const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 10000;

// ✅ เปลี่ยนตรงนี้เป็น URL ของ Apps Script ที่เพิ่ง Deploy เสร็จ
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxadrSxwwAY6BA1We9iTuZT8Xagzse04bo0b_TkwSgjMjzOaIsM6z5vTRNb3ejRgY3QYQ/exec";

app.use(cors());          // อนุญาตให้เว็บอื่น (แมพ WorkAdventure) ยิงมาหาเราได้
app.use(express.json());  // ให้ Express อ่าน JSON body ได้

app.get('/', (req, res) => res.send("🚀 WorkAdventure Attendance System is Running"));

app.post('/log', async (req, res) => {
  const { name, type } = req.body;

  console.log(`📩 ได้รับข้อมูล: name=${name}, type=${type}`);

  if (!name) {
    return res.status(400).json({ status: "error", message: "missing name" });
  }

  try {
    await axios.post(SCRIPT_URL, { name, type });
    console.log(`✅ ${name}: ส่งเข้า Sheet สำเร็จ`);
    res.json({ status: "success" });
  } catch (err) {
    console.error(`❌ ${name}: ส่งเข้า Sheet ไม่สำเร็จ`, err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(port, () => console.log(`🌍 Server active on port ${port}`));
