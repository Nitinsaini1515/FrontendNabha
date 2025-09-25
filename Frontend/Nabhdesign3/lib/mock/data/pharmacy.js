export const seedInventory = [
  { id: "med-1", name: "Paracetamol 500mg", stock: 120, price: 25, category: "Analgesic" },
  { id: "med-2", name: "Amoxicillin 500mg", stock: 60, price: 80, category: "Antibiotic" },
  { id: "med-3", name: "Amlodipine 5mg", stock: 75, price: 55, category: "Antihypertensive" }
]

export const seedOrders = [
  { id: "ord-1", patientId: "u-patient-1", items: [{ id: "med-3", qty: 1 }], status: "processing", total: 55 },
  { id: "ord-2", patientId: "u-patient-1", items: [{ id: "med-1", qty: 2 }], status: "delivered", total: 50 }
]


