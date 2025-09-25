import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Appointment from "../models/appointment.js";
import MedicalRecord from "../models/medicalrecord.js";
import Prescription from "../models/prescription.js";
import User from "../models/userdata.js";

// 1. Get doctor appointments
export const getappointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id })
    .populate("patient", "name email phone age bloodGroup")
    .sort({ date: -1 });
  
  return res.json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});

// 2. Update appointment status
export const updateappointmentstatus = asyncHandler(async (req, res) => {
  const { appointmentid } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findOne({
    _id: appointmentid,
    doctor: req.user._id
  });

  if (!appointment) throw new ApiError(404, "Appointment not found");

  appointment.status = status || appointment.status;
  await appointment.save();

  return res.json(new ApiResponse(200, appointment, "Appointment updated successfully"));
});

// 3. Access patient records
export const getpatientrecords = asyncHandler(async (req, res) => {
  const { patientid } = req.params;
  const records = await MedicalRecord.find({ patient: patientid })
    .populate("doctor", "name specialization")
    .sort({ date: -1 });

  return res.json(new ApiResponse(200, records, "Patient records fetched successfully"));
});

// 4. Create prescription
export const createPrescription = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, diagnosis, medications, additionalInstructions, followUpDate } = req.body;
  
  if (!patientId || !diagnosis || !medications || medications.length === 0) {
    throw new ApiError(400, "Patient ID, diagnosis, and medications are required");
  }

  // Calculate total amount
  const totalAmount = medications.reduce((sum, med) => sum + (med.price || 0), 0);

  const prescription = await Prescription.create({
    patient: patientId,
    doctor: req.user._id,
    appointment: appointmentId,
    diagnosis,
    medications,
    additionalInstructions,
    followUpDate,
    totalAmount,
  });

  // Update appointment with prescription reference
  if (appointmentId) {
    await Appointment.findByIdAndUpdate(appointmentId, { 
      diagnosis,
      consultationNotes: additionalInstructions 
    });
  }

  return res.status(201).json(new ApiResponse(201, prescription, "Prescription created successfully"));
});

// 5. Get doctor prescriptions
export const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({ doctor: req.user._id })
    .populate("patient", "name email phone age")
    .populate("appointment", "date time type")
    .sort({ createdAt: -1 });

  return res.json(new ApiResponse(200, prescriptions, "Prescriptions fetched successfully"));
});

// 6. Update appointment with consultation details
export const updateAppointmentConsultation = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { consultationNotes, diagnosis, treatment, vitalSigns } = req.body;

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: req.user._id
  });

  if (!appointment) throw new ApiError(404, "Appointment not found");

  appointment.consultationNotes = consultationNotes || appointment.consultationNotes;
  appointment.diagnosis = diagnosis || appointment.diagnosis;
  appointment.treatment = treatment || appointment.treatment;
  appointment.vitalSigns = vitalSigns || appointment.vitalSigns;

  await appointment.save();

  return res.json(new ApiResponse(200, appointment, "Appointment consultation updated successfully"));
});

// 7. Get doctor dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStats = {
    totalAppointments: await Appointment.countDocuments({ 
      doctor: req.user._id, 
      date: { $gte: today, $lt: tomorrow } 
    }),
    completed: await Appointment.countDocuments({ 
      doctor: req.user._id, 
      status: "completed",
      date: { $gte: today, $lt: tomorrow }
    }),
    pending: await Appointment.countDocuments({ 
      doctor: req.user._id, 
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: today, $lt: tomorrow }
    }),
    cancelled: await Appointment.countDocuments({ 
      doctor: req.user._id, 
      status: "cancelled",
      date: { $gte: today, $lt: tomorrow }
    })
  };

  const totalPatients = await Appointment.distinct("patient", { doctor: req.user._id });
  
  const stats = {
    ...todayStats,
    totalPatients: totalPatients.length,
    totalPrescriptions: await Prescription.countDocuments({ doctor: req.user._id })
  };

  return res.json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

// 8. Update doctor availability
export const updateAvailability = asyncHandler(async (req, res) => {
  const { isAvailable } = req.body;
  
  const doctor = await User.findByIdAndUpdate(
    req.user._id,
    { isAvailable },
    { new: true }
  ).select("-password");

  return res.json(new ApiResponse(200, { doctor }, "Availability updated successfully"));
});
