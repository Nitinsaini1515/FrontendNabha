import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    licenseNumber: { type: String },
    location: { type: String },
    rating: { type: Number, default: 0 },
    medicines: [
      {
        name: { type: String, required: true },
        stock: { type: Number, default: 0 },
        minStock: { type: Number, default: 10 },
        price: { type: Number, default: 0 },
        category: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy;
