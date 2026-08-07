// script.js - ระบบเช็คคนเข้าเว็บ
WA.onInit().then(async () => {
    console.log("✅ สคริปต์โหลดแล้ว ผู้เล่นคือ: " + WA.player.name);

    // ✅ ส่งข้อมูล login ก่อน แล้วรอให้เสร็จ ค่อยเปิดการเช็ค meeting room
    try {
        await fetch("https://work-adventure-map.onrender.com/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: WA.player.name,
                type: "login"
            })
        });
        console.log("✅ ส่งข้อมูล login สำเร็จ");
    } catch (err) {
        console.error("❌ ส่งข้อมูล login ไม่สำเร็จ", err);
    }

    // ✅ เช็คตอนเดินเข้าโซน Meeting Room (ทำงานหลัง login เสมอ)
    WA.room.area.onEnter("meeting-room").subscribe(() => {
        console.log("🏢 เข้าห้องประชุมแล้ว: " + WA.player.name);
        fetch("https://work-adventure-map.onrender.com/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: WA.player.name,
                type: "meeting_room"
            })
        })
        .then(() => console.log("✅ ส่งข้อมูล meeting_room สำเร็จ"))
        .catch((err) => console.error("❌ ส่งข้อมูล meeting_room ไม่สำเร็จ", err));
    });
});
