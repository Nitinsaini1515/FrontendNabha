import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientAddress: { type: String },
    doctorName: { type: String, required: true },
    prescriptionDate: { type: Date, required: true },
    orderTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "preparing", "completed", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    deliveryType: {
      type: String,
      enum: ["pickup", "delivery"],
      default: "pickup",
    },
    medications: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        inStock: { type: Boolean, default: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// Generate order ID before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderId = `ORD-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
