import { seedUsers, redactUser } from "./data/auth"
import { seedAppointments, seedRecords, seedReminders, seedInsuranceSchemes } from "./data/patient"
import { seedDoctorAppointments } from "./data/doctor"
import { seedInventory, seedOrders } from "./data/pharmacy"
import { readCollection, writeCollection, upsertItem, deleteItem, generateId } from "./storage"

const LATENCY_MS = 200

function delay(result, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(result)
      else resolve(result)
    }, LATENCY_MS)
  })
}

function ensureSeeded() {
  // Seed only once
  if (readCollection("users").length === 0) {
    writeCollection("users", seedUsers)
  }
  if (readCollection("appointments").length === 0) {
    writeCollection("appointments", seedAppointments)
  }
  if (readCollection("records").length === 0) {
    writeCollection("records", seedRecords)
  }
  if (readCollection("reminders").length === 0) {
    writeCollection("reminders", seedReminders)
  }
  if (readCollection("insuranceSchemes").length === 0) {
    writeCollection("insuranceSchemes", seedInsuranceSchemes)
  }
  if (readCollection("doctorAppointments").length === 0) {
    writeCollection("doctorAppointments", seedDoctorAppointments)
  }
  if (readCollection("inventory").length === 0) {
    writeCollection("inventory", seedInventory)
  }
  if (readCollection("orders").length === 0) {
    writeCollection("orders", seedOrders)
  }
}

ensureSeeded()

function success(data) {
  return { success: true, data }
}

function failure(message) {
  return { success: false, message }
}

export const mockApi = {
  login: async ({ email, password }) => {
    ensureSeeded()
    const user = readCollection("users").find((u) => u.email === email)
    if (!user || user.password !== password) {
      return delay(failure("Invalid credentials"))
    }
    const token = `mock-token-${user.id}`
    return delay(success({ user: redactUser(user), token }))
  },

  register: async (userData) => {
    ensureSeeded()
    const users = readCollection("users")
    if (users.some((u) => u.email === userData.email)) {
      return delay(failure("Email already registered"))
    }
    const id = generateId("u")
    const user = { id, ...userData }
    upsertItem("users", user)
    const token = `mock-token-${id}`
    return delay(success({ user: redactUser(user), token }))
  },

  // Patient
  getPatientProfile: async (token) => {
    const userId = token?.replace("mock-token-", "")
    const user = readCollection("users").find((u) => u.id === userId)
    if (!user || user.role !== "patient") return delay(failure("Unauthorized"))
    return delay(success({ profile: redactUser(user) }))
  },
  getPatientAppointments: async (token) => {
    const userId = token?.replace("mock-token-", "")
    const items = readCollection("appointments").filter((a) => a.patientId === userId)
    return delay(success({ appointments: items }))
  },
  bookAppointment: async (appointmentData, token) => {
    const userId = token?.replace("mock-token-", "")
    const id = generateId("a")
    const appt = { id, patientId: userId, status: "confirmed", ...appointmentData }
    upsertItem("appointments", appt)
    return delay(success({ appointment: appt }))
  },
  getMedicalRecords: async (token) => {
    const userId = token?.replace("mock-token-", "")
    const items = readCollection("records").filter((r) => r.patientId === userId)
    return delay(success({ records: items }))
  },
  getMedicalReminders: async (token) => {
    const userId = token?.replace("mock-token-", "")
    const items = readCollection("reminders").filter((r) => r.patientId === userId)
    return delay(success({ reminders: items }))
  },
  createMedicalReminder: async (reminderData, token) => {
    const userId = token?.replace("mock-token-", "")
    const item = { id: generateId("m"), patientId: userId, active: true, ...reminderData }
    upsertItem("reminders", item)
    return delay(success({ reminder: item }))
  },
  getInsuranceSchemes: async () => {
    return delay(success({ schemes: readCollection("insuranceSchemes") }))
  },
  applyInsuranceScheme: async (applicationData, token) => {
    const userId = token?.replace("mock-token-", "")
    if (!userId) return delay(failure("Unauthorized"))
    return delay(success({ applicationId: generateId("ins-app"), status: "received", ...applicationData }))
  },

  // Doctor
  getDoctorAppointments: async (token) => {
    const userId = token?.replace("mock-token-", "")
    const items = readCollection("appointments").filter((a) => a.doctorId === userId)
    return delay(success({ appointments: items }))
  },
  getDoctorProfile: async (token) => {
    const userId = token?.replace("mock-token-", "")
    const user = readCollection("users").find((u) => u.id === userId)
    if (!user || user.role !== "doctor") return delay(failure("Unauthorized"))
    return delay(success({ profile: redactUser(user) }))
  },

  // Pharmacy
  getPharmacyInventory: async () => {
    return delay(success({ inventory: readCollection("inventory") }))
  },
  getPharmacyOrders: async () => {
    return delay(success({ orders: readCollection("orders") }))
  },
  getPharmacyProfile: async (token) => {
    const userId = token?.replace("mock-token-", "")
    const user = readCollection("users").find((u) => u.id === userId)
    if (!user || user.role !== "pharmacy") return delay(failure("Unauthorized"))
    return delay(success({ profile: redactUser(user) }))
  },

  // Symptom checker
  analyzeSymptoms: async (symptomData) => {
    const { symptoms = "" } = symptomData || {}
    const lower = symptoms.toLowerCase()
    let assessment = "General check recommended"
    if (lower.includes("chest") || lower.includes("breath")) assessment = "Possible cardiac issue"
    else if (lower.includes("fever")) assessment = "Likely viral infection"
    return delay(success({ assessment, severity: assessment === "Possible cardiac issue" ? "high" : "low" }))
  },

  // Admin helpers
  resetAll: async () => {
    writeCollection("users", seedUsers)
    writeCollection("appointments", seedAppointments)
    writeCollection("records", seedRecords)
    writeCollection("reminders", seedReminders)
    writeCollection("insuranceSchemes", seedInsuranceSchemes)
    writeCollection("doctorAppointments", seedDoctorAppointments)
    writeCollection("inventory", seedInventory)
    writeCollection("orders", seedOrders)
    return delay(success({}))
  }
}


