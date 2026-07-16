<template>
  <div class="app-container">
    <h2>บันทึกประวัติการซ่อม</h2>
    
    <div class="card">
      <form @submit.prevent="submitService">
        <div class="form-group">
          <label>ประเภทการซ่อม:</label>
          <select v-model="form.type">
            <option value="น้ำมันเครื่อง">เปลี่ยนน้ำมันเครื่อง</option>
            <option value="ผ้าเบรก">เปลี่ยนผ้าเบรก</option>
          </select>
        </div>

        <div class="form-group">
          <label>ค่าอะไหล่ (บาท):</label>
          <input type="number" v-model.number="form.partPrice" required />
        </div>

        <div class="form-group">
          <label>ค่าแรง (บาท):</label>
          <input type="number" v-model.number="form.laborPrice" required />
        </div>

        <div class="form-group">
          <label>เลขไมล์ปัจจุบัน (กม.):</label>
          <input type="number" v-model.number="form.currentMileage" required />
        </div>

        <div class="form-group">
          <label>เลขไมล์ที่เปลี่ยนครั้งก่อน (กม.):</label>
          <input type="number" v-model.number="form.lastServiceMileage" required />
        </div>

        <div class="form-group">
          <label>หมายเหตุ (Note):</label>
          <textarea v-model="form.note" placeholder="กรอกหมายเหตุที่นี่..." rows="3"></textarea>
        </div>

        <button type="submit" class="btn-submit">บันทึกข้อมูล</button>
      </form>
    </div>

    <div class="card">
      <h3>ยอดรวมค่าใช้จ่ายทั้งหมด: <span class="total-cost">{{ totalCost }} บาท</span></h3>
      
      <h3>รายการประวัติการซ่อมบำรุง</h3>
      <button @click="fetchData" class="btn-refresh">🔄 ดึงข้อมูลล่าสุด</button>
      
      <table class="data-table" v-if="services.length > 0">
        <thead>
          <tr>
            <th>วันที่</th>
            <th>ประเภท</th>
            <th>ค่าอะไหล่</th>
            <th>ค่าแรง</th>
            <th>เลขไมล์ปัจจุบัน</th>
            <th>หมายเหตุ</th>
            <th>สถานะแจ้งเตือน</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in services" :key="item.id">
            <td>{{ item.date }}</td>
            <td><strong>{{ item.type }}</strong></td>
            <td>{{ item.partPrice }} บ.</td>
            <td>{{ item.laborPrice }} บ.</td>
            <td>{{ item.currentMileage }} กม.</td>
            <td>{{ item.note }}</td>
            <td :class="statusClass(item.status)">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else style="color: #888;">ยังไม่มีประวัติการบันทึกข้อมูล</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// ตัวแปร Reactive ของหน้าจอ
const services = ref([])
const totalCost = ref(0)
const form = ref({
  type: 'น้ำมันเครื่อง',
  partPrice: 1200,
  laborPrice: 300,
  currentMileage: 45000,
  lastServiceMileage: 35000,
  note: ''
})

// ฟังก์ชันดึงข้อมูลจาก Backend API ที่เราเพิ่งเขียนไว้
const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/dashboard')
    services.value = response.data.services
    totalCost.value = response.data.totalCost
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('ไม่สามารถเชื่อมต่อหลังบ้านได้ กรุณาเปิด Server หลังบ้านไว้ด้วยนะครับ')
  }
}

// ฟังก์ชันส่งข้อมูลฟอร์มไปบันทึกที่หลังบ้าน
const submitService = async () => {
  try {
    await axios.post('http://localhost:3000/api/services', form.value)
    alert('บันทึกข้อมูลสำเร็จ!')
    // เคลียร์ฟอร์มกลับมาค่าเริ่มต้นบางส่วน
    form.value.partPrice = 0
    form.value.laborPrice = 0
    form.value.note = ''
    // ดึงข้อมูลใหม่มาแสดงทันที
    fetchData()
  } catch (error) {
    console.error('Error submitting data:', error)
    alert('บันทึกข้อมูลไม่สำเร็จ')
  }
}

// กำหนดสีของสถานะแจ้งเตือน
const statusClass = (status) => {
  if (status.includes('เกินระยะ')) return 'status-danger'
  if (status.includes('ใกล้ถึงรอบ')) return 'status-warning'
  return 'status-ok'
}

// เมื่อเปิดหน้าเว็บ ให้มาดึงข้อมูลรอบแรกทันที
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}
.card {
  background: #595959ff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 15px;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}
.btn-submit {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}
.btn-refresh {
  background-color: #35495e;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
}
.total-cost {
  color: #e03131;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.data-table th {
  background-color: #5d5d5dff;
}
.status-danger {
  color: red;
  font-weight: bold;
}
.status-warning {
  color: orange;
  font-weight: bold;
}
.status-ok {
  color: green;
}
</style>