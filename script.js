// ✅ เปลี่ยนตรงนี้เป็น URL จริงของ Render backend (workadventure-server.js ที่ deploy แล้ว)
const BACKEND_URL = "https://wa-login-logs-3q0j.onrender.com/log";

// ✅ ชื่อโซน Meeting Room ตามที่ตั้งไว้ใน Tiled (object ที่ตั้ง Class เป็น "area")
const MEETING_ROOM_AREA = "meeting-room";

let hasLoggedInToday = false;

WA.onInit().then(() => {
  console.log("✅ WorkAdventure script initialized");

  // ✅ ยิง login ครั้งเดียวตอนเข้าห้อง (กันยิงซ้ำถ้า script รันมากกว่า 1 ครั้งในเซสชันเดียว)
  sendLog("login");

  // ✅ ดักตอนเข้าโซน Meeting Room (โซนนี้เป็น object class "area" ใน Tiled ไม่ใช่ tile layer
  // จึงต้องใช้ WA.room.area.onEnter แทน WA.room.onEnterLayer)
  WA.room.area.onEnter(MEETING_ROOM_AREA).subscribe(() => {
    console.log("🏢 Entered meeting room zone");
    sendLog("meeting_room");
  });

}).catch((err) => {
  console.error("❌ WA.onInit() failed:", err);
});

async function sendLog(type) {
  try {
    const name = WA.player.name;
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    const data = await res.json();
    console.log(`📩 sendLog(${type}) ->`, data);
  } catch (err) {
    console.error(`❌ sendLog(${type}) failed:`, err);
  }
}
WA.onInit().then(async () => {
    console.log("✅ WorkAdventure script initialized");

    await sendLog("login");
    await sendLog("meeting_room");

    WA.room.area.onEnter(MEETING_ROOM_AREA).subscribe(() => {
        console.log("🏢 Entered meeting room zone");
        sendLog("meeting_room");
    });

    // ✅ ส่ง heartbeat ทุก 30 นาที กันเคส "ค้างในระบบ" ไม่เด้งชื่อ
    setInterval(() => {
        sendLog("heartbeat");
    }, 30 * 60 * 1000);
}).catch((err) => {
    console.error("❌ WA.onInit() failed:", err);
});
