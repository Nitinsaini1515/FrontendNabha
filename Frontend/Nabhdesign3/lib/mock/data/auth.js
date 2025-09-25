// Seed users for mock auth. Passwords are plain for demo only.
export const seedUsers = [
  {
    id: "u-patient-1",
    role: "patient",
    name: "Rajesh Kumar",
    email: "patient@example.com",
    phone: "+91 98765 43210",
    password: "patient123",
    age: 35,
    bloodGroup: "B+",
    avatarUrl: "/placeholder-user.jpg"
  },
  {
    id: "u-doctor-1",
    role: "doctor",
    name: "Dr. Priya Sharma",
    email: "doctor@example.com",
    phone: "+91 98765 40000",
    password: "doctor123",
    specialization: "Cardiology",
    degree: "MD",
    experience: 10,
    hospital: "Nabha Hospital",
    avatarUrl: "/placeholder-user.jpg"
  },
  {
    id: "u-pharmacy-1",
    role: "pharmacy",
    name: "Nabha Care Pharmacy",
    email: "pharmacy@example.com",
    phone: "+91 98765 45555",
    password: "pharmacy123",
    pharmacyName: "Nabha Care Pharmacy",
    pharmacyAddress: "1, MG Road, Nabha City",
    licenseNumber: "LIC-23910",
    avatarUrl: "/placeholder-user.jpg"
  }
]

export function redactUser(user) {
  const { password, ...safe } = user
  return safe
}


