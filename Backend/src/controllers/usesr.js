import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/userdata.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = asyncHandler(async (req, res) => {
  const { 
    name, email, password, role, phone, address, 
    // Patient fields
    age, bloodGroup,
    // Doctor fields
    specialization, experience, degree, hospital, consultationFee,
    // Pharmacy fields
    pharmacyName, pharmacyAddress, pharmacyType, servicesOffered, licenseNumber
  } = req.body;
  
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "patient",
    phone,
    address,
    // Patient fields
    age,
    bloodGroup,
    // Doctor fields
    specialization,
    experience,
    degree,
    hospital,
    consultationFee,
    // Pharmacy fields
    pharmacyName,
    pharmacyAddress,
    pharmacyType,
    servicesOffered,
    licenseNumber,
  });

  const token = user.generateJWT();
  const safeUser = user.toObject();
  delete safeUser.password;

  res
    .cookie("token", token, cookieOptions)
    .status(201)
    .json(new ApiResponse(201, { user: safeUser }, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = user.generateJWT();
  const safeUser = user.toObject();
  delete safeUser.password;

  res
    .cookie("token", token, cookieOptions)
    .status(200)
    .json(new ApiResponse(200, { user: safeUser }, "Logged in successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  res
    .clearCookie("token", { ...cookieOptions, maxAge: 0 })
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  
  res.status(200).json(new ApiResponse(200, { user }, "Profile fetched successfully"));
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    'name', 'phone', 'address', 'age', 'bloodGroup',
    'specialization', 'experience', 'degree', 'hospital', 'consultationFee',
    'pharmacyName', 'pharmacyAddress', 'pharmacyType', 'servicesOffered', 'licenseNumber'
  ];
  
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, { user }, "Profile updated successfully"));
});

// Get doctors list (for appointment booking)
export const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: "doctor" })
    .select("name specialization experience consultationFee hospital rating totalPatients isAvailable");
  
  res.status(200).json(new ApiResponse(200, { doctors }, "Doctors fetched successfully"));
});


