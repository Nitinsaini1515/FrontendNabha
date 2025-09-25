import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "clinic"],
      default: "clinic",
    },
    symptoms: { type: String },
    duration: { type: String, default: "30 min" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    medicalHistory: { type: String },
    currentMedications: { type: String },
    allergies: { type: String },
    vitalSigns: {
      bloodPressure: { type: String },
      heartRate: { type: String },
      temperature: { type: String },
      weight: { type: String },
    },
    consultationNotes: { type: String },
    diagnosis: { type: String },
    treatment: { type: String },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
