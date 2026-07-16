# Car Maintenance Tracker 

ระบบบันทึกและติดตามประวัติการบำรุงรักษารถยนต์

โปรเจกต์นี้แบ่งโครงสร้างออกเป็น 2 ส่วนหลัก:

### 1. 🖥️ Front-end (`my-vue-app`)
* **Framework:** Vue 3 (Single File Components - SFC)
* **Build Tool:** Vite
* **State Management & Logic:** ใช้ Composition API (`<script setup>`)
* **Styling:** CSS (Scoped)

### 2. ⚙️ Back-end (`my-car-backend`)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** JSON File Database (จำลองระบบการอ่าน-เขียนไฟล์แบบกึ่งฐานข้อมูลจริง)
* **Data Flow:** เชื่อมต่อและส่งผ่านข้อมูลผ่าน RESTful API ด้วย Axios

🚀 How to Run (วิธีการเปิดใช้งานระบบในเครื่อง)
สเต็ปที่ 1: ติดตั้งและเริ่มทำงานฝั่ง Back-end
เปิด Terminal แล้วเข้าไปยังโฟลเดอร์หลังบ้าน:

Bash
cd my-car-backend
ติดตั้ง Dependencies และสั่งรัน Server:

Bash
npm install
node server.js


สเต็ปที่ 2: ติดตั้งและเริ่มทำงานฝั่ง Front-end
เปิด Terminal อีกหน้าต่าง แล้วเข้าไปยังโฟลเดอร์หน้าบ้าน:

Bash
cd my-vue-app
ติดตั้ง Dependencies และรันแบบ Development Mode:

Bash
npm install
npm run dev
เปิดเบราว์เซอร์ไปยังลิงก์ที่แสดงในหน้าจอ (ปกติจะเป็น http://localhost:5173/) เพื่อใช้งานระบบ
