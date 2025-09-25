import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "pharmacy"],
      required: true,
      default: "patient",
      index: true,
    },
    // Common profile fields
    phone: { type: String },
    address: { type: String },
    
    // Patient specific fields
    age: { type: Number },
    bloodGroup: { type: String },
    
    // Doctor specific fields
    specialization: { type: String },
    experience: { type: String },
    degree: { type: String },
    hospital: { type: String },
    consultationFee: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    
    // Pharmacy specific fields
    pharmacyName: { type: String },
    pharmacyAddress: { type: String },
    pharmacyType: { type: String },
    servicesOffered: { type: String },
    licenseNumber: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateJWT = function () {
  const payload = { id: this._id, role: this.role };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "7d",
  });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

