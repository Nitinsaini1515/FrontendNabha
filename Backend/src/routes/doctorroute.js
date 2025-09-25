import express from "express";
import { protect, authorizeRoles } from "../middlewares/authmiddleware.js";
import {
  getappointments,
  updateappointmentstatus,
  getpatientrecords,
  createPrescription,
  getPrescriptions,
  updateAppointmentConsultation,
  getDashboardStats,
  updateAvailability,
} from "../controllers/doctorcontroller.js";

const router = express.Router();

// allow only doctors
router.use(protect, authorizeRoles("doctor"));

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Appointments
router.get("/appointments", getappointments);
router.put("/appointments/:appointmentid", updateappointmentstatus);
router.put("/appointments/:appointmentId/consultation", updateAppointmentConsultation);

// Prescriptions
router.post("/prescriptions", createPrescription);
router.get("/prescriptions", getPrescriptions);

// Patient records
router.get("/records/:patientid", getpatientrecords);

// Profile
router.put("/availability", updateAvailability);

export default router;

