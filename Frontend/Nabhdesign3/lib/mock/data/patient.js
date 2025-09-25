export const seedAppointments = [
  {
    id: "a-1",
    patientId: "u-patient-1",
    doctorId: "u-doctor-1",
    doctorName: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    date: "2024-01-15",
    time: "10:30 AM",
    type: "video",
    status: "confirmed"
  }
]

export const seedRecords = [
  {
    id: "r-1",
    patientId: "u-patient-1",
    type: "Prescription",
    doctor: "Dr. Priya Sharma",
    date: "2024-01-10",
    title: "Blood Pressure Medication"
  }
]

export const seedReminders = [
  {
    id: "m-1",
    patientId: "u-patient-1",
    title: "Morning BP Medicine",
    time: "08:00",
    frequency: "daily",
    active: true
  }
]

export const seedInsuranceSchemes = [
  {
    id: "ins-1",
    name: "Ayushman Bharat",
    description: "Government health insurance scheme for low-income families.",
    coverage: "Up to ₹5,00,000 per family per year"
  },
  {
    id: "ins-2",
    name: "Nabha Care Plus",
    description: "Private plan with wider hospital network",
    coverage: "Up to ₹10,00,000 per person per year"
  }
]


