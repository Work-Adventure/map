const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

// ✅ เปลี่ยนตรงนี้เป็น URL ของ Apps Script ที่เพิ่ง Deploy เสร็จ
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCtfBrIDUyRblUC4b_0ZM53QUko5bLVuurpYfhZxJFRD287aeAA5ITXmqG3_jXzKAe/exec";

app.use(cors());          // อนุญาตให้เว็บอื่น (แมพ WorkAdventure) ยิงมาหาเราได้
app.use(express.json());  // ให้ Express อ่าน JSON body ได้

app.get('/', (req, res) => res.send("🚀 WorkAdventure Attendance System is Running"));

// เช็คว่าตอนนี้อยู่ในช่วงเวลาที่นับ log หรือเปล่า
// เงื่อนไขเดียวกับที่ใช้ตอน Gather Town: จันทร์-ศุกร์ + 08:00-18:00 (เวลาไทย) เท่านั้น
// นอกช่วงนี้ยังเข้าเว็บได้ปกติ แค่ไม่บันทึกลง Sheet
function isWithinLoggingWindow() {
  const now = new Date();
  const thTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  const day = thTime.getDay();   // 0 = อาทิตย์, 6 = เสาร์
  const hour = thTime.getHours();

  if (day === 0 || day === 6) return false; // เสาร์-อาทิตย์ ไม่นับ
  if (hour < 8 || hour >= 18) return false; // นอกช่วง 08:00-18:00 ไม่นับ
  return true;
}

app.post('/log', async (req, res) => {
  const { name, type } = req.body;
  console.log(`📩 ได้รับข้อมูล: name=${name}, type=${type}`);

  if (!name) {
    return res.status(400).json({ status: "error", message: "missing name" });
  }

  // เช็คเงื่อนไขวัน/เวลาก่อนส่งเข้า Sheet (เหมือนที่ Gather Town เคยเช็คใน bot)
  if (!isWithinLoggingWindow()) {
    console.log(`⏭️ ${name}: อยู่นอกช่วงเวลาที่นับ (จ-ศ 08:00-18:00) ข้ามไม่บันทึก`);
    return res.json({ status: "skipped", message: "outside logging window" });
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
