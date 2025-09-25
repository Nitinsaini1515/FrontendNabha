import axios from "axios";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Video from "../models/video.js";
import Pharmacy from "../models/pharmacy.js";
import MedicalRecord from "../models/medicalrecord.js";
import Appointment from "../models/appointment.js";
import User from "../models/userdata.js";
import dotenv from "dotenv";

dotenv.config();

// 1. AI symptom checker
export const checksymptoms = asyncHandler(async (req, res) => {
  const { symptoms } = req.body;

  let symptomsArray = [];
  if (Array.isArray(symptoms)) {
    symptomsArray = symptoms.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof symptoms === "string") {
    symptomsArray = symptoms
      .split(/,|\n|\r|\;/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (!symptomsArray.length) {
    throw new ApiError(400, "please provide symptoms as an array or comma-separated string");
  }

  const symptomText = symptomsArray.join(", ");
  const prompt = `Patient reports the following symptoms: ${symptomText}. 
Suggest possible medical conditions (up to 5) in a concise list.`;

  if (!process.env.OPENAI_API_KEY) {
    throw new ApiError(500, "OPENAI_API_KEY is not configured on the server");
  }

  let possibleconditions = "";
  try {
    // Call OpenAI API using Axios
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 20000,
      }
    );

    possibleconditions = response.data?.choices?.[0]?.message?.content || "";
  } catch (err) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message || "Unknown error";
    throw new ApiError(status, "Failed to fetch AI symptom analysis", [details]);
  }

  return res.json(
    new ApiResponse(200, { symptoms: symptomsArray, possibleconditions }, "AI symptom check completed")
  );
});

// 2. Get video library
export const getvideos = asyncHandler(async (req, res) => {
  const videos = await Video.find();
  return res.json(new ApiResponse(200, videos, "videos fetched successfully"));
});

// 3. Search medicine in pharmacies
export const searchmedicine = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const pharmacies = await Pharmacy.find({ "medicines.name": { $regex: name, $options: "i" } });

  return res.json(new ApiResponse(200, pharmacies, `availability for medicine: ${name}`));
});

// 4. Upload medical record
export const uploadrecord = asyncHandler(async (req, res) => {
  const { fileurl, description } = req.body;
  if (!fileurl) throw new ApiError(400, "file url required");

  const record = await MedicalRecord.create({
    patient: req.user._id,
    fileurl,
    description,
  });

  return res.status(201).json(new ApiResponse(201, record, "record uploaded successfully"));
});

// 5. Get patient medical records
export const getrecords = asyncHandler(async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.user._id });
  return res.json(new ApiResponse(200, records, "records fetched successfully"));
});

// 6. Book appointment
export const bookappointment = asyncHandler(async (req, res) => {
  const { doctorid, date, time, type, symptoms, duration } = req.body;
  if (!doctorid || !date || !time) {
    throw new ApiError(400, "doctor, date and time required");
  }

  const doctor = await User.findById(doctorid);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  if (doctor.role !== "doctor") {
    throw new ApiError(400, "Provided user is not a doctor");
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorid,
    date,
    time,
    type: type || "clinic",
    symptoms,
    duration: duration || "30 min",
  });

  return res.status(201).json(new ApiResponse(201, appointment, "appointment booked successfully"));
});

// 7. Get patient appointments
export const getappointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate("doctor", "name email specialization experience consultationFee")
    .sort({ date: -1 });
  return res.json(new ApiResponse(200, appointments, "appointments fetched successfully"));
});

// 8. Get patient dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalAppointments = await Appointment.countDocuments({ patient: req.user._id });
  const upcomingAppointments = await Appointment.countDocuments({ 
    patient: req.user._id, 
    status: { $in: ["pending", "confirmed"] },
    date: { $gte: new Date() }
  });
  const totalRecords = await MedicalRecord.countDocuments({ patient: req.user._id });
  
  const stats = {
    totalAppointments,
    upcomingAppointments,
    totalRecords,
    completedAppointments: await Appointment.countDocuments({ 
      patient: req.user._id, 
      status: "completed" 
    })
  };
  
  return res.json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});
