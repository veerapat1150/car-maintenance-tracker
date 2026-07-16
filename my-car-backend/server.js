const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// เส้นทางสำหรับไฟล์จำลองฐานข้อมูล (เก็บเป็นไฟล์ JSON)
const DATA_FILE = path.join(__dirname, 'database.json');

// ฟังก์ชันช่วยอ่านข้อมูลจากไฟล์ JSON
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        // ถ้ายังไม่มีไฟล์ ให้สร้างข้อมูลเริ่มต้นเปล่าๆ ขึ้นมา
        const initialData = { vehicles: [], serviceLogs: [] };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// ฟังก์ชันช่วยเขียนข้อมูลลงไฟล์ JSON
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// ==========================================
// [LOGIC] 1. API สำหรับดึงประวัติการซ่อมทั้งหมดและคำนวณแจ้งเตือน
// ==========================================
app.get('/api/dashboard', (req, res) => {
    const db = readData();

    // สมมติตรรกะ (Logic) รอบการซ่อมบำรุงพื้นฐาน
    // น้ำมันเครื่อง: ควรเปลี่ยนทุกๆ 8,000 กม.
    const OIL_CHANGE_LIMIT = 10000;
    const BRAKE_CHANGE_LIMIT = 40000;

    // ตรงนี้คือ Business Logic ที่เราเอาไว้โชว์ผู้ประเมินงาน
    const processedLogs = db.serviceLogs.map(log => {
        let status = "ปกติ";

        if (log.type === "น้ำมันเครื่อง") {
            const currentDistance = log.currentMileage - log.lastServiceMileage;
            if (currentDistance >= OIL_CHANGE_LIMIT) {
                status = "เกินระยะที่ต้องเปลี่ยน! (Overdue)";
            } else if (OIL_CHANGE_LIMIT - currentDistance <= 1000) {
                status = "ใกล้ถึงรอบเปลี่ยน (Warning)";
            }
        } else if (log.type === "ผ้าเบรก") {
            const currentDistance = log.currentMileage - log.lastServiceMileage
            if (currentDistance >= BRAKE_CHANGE_LIMIT) {
                status = "เกินระยะที่ต้องเปลี่ยน! (Overdue)";
            } else if (BRAKE_CHANGE_LIMIT - currentDistance <= 2000) {
                status = "ใกล้ถึงรอบเปลี่ยน (Warning)";
            }

        }

        return { ...log, status };
    });

    // คำนวณ Logic สรุปค่าใช้จ่ายรวมทั้งหมด (Financial Logic)
    const totalCost = db.serviceLogs.reduce((sum, log) => sum + (Number(log.partPrice || 0) + Number(log.laborPrice || 0)), 0);

    res.json({
        totalCost,
        services: processedLogs
    });
});

// ==========================================
// [LOGIC] 2. API สำหรับการกดบันทึกประวัติการซ่อมใหม่ (CRUD - Create)
// ==========================================
app.post('/api/services', (req, res) => {
    const db = readData();
    const newLog = {
        id: Date.now(), // ใช้ timestamp ทำเป็น ID จำลอง
        type: req.body.type,                // เช่น น้ำมันเครื่อง, ผ้าเบรก, ทำสี
        partPrice: Number(req.body.partPrice || 0),   // ราคาอะไหล่
        laborPrice: Number(req.body.laborPrice || 0), // ค่าแรง
        currentMileage: Number(req.body.currentMileage || 0), // เลขไมล์ปัจจุบัน
        lastServiceMileage: Number(req.body.lastServiceMileage || 0), // เลขไมล์ที่เคยเปลี่ยนรอบก่อน
        note: req.body.note || '', // หมายเหตุ
        date: req.body.date || new Date().toISOString().split('T')[0]
    };

    db.serviceLogs.push(newLog);
    writeData(db);

    res.status(201).json({ message: "บันทึกข้อมูลสำเร็จ", data: newLog });
});

app.listen(PORT, () => {
    console.log(`Server หลังบ้านกำลังรันอยู่ที่ http://localhost:${PORT}`);
});