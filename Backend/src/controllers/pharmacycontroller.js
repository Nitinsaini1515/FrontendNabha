import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Pharmacy from "../models/pharmacy.js";
import Order from "../models/order.js";
import User from "../models/userdata.js";
import mongoose from "mongoose";

// 1. get pharmacy medicines
export const getmedicines = asyncHandler(async (req, res) => {
  const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
  if (!pharmacy) throw new ApiError(404, "pharmacy not found");

  return res.json(new ApiResponse(200, pharmacy.medicines, "medicines fetched successfully"));
});

// 2. add new medicine
export const addmedicine = asyncHandler(async (req, res) => {
  const { name, stock } = req.body;
  if (!name || typeof name !== "string") throw new ApiError(400, "medicine name required");
  const parsedStock = Number.isFinite(Number(stock)) ? Number(stock) : 0;

  let pharmacy = await Pharmacy.findOne({ owner: req.user._id });
  if (!pharmacy) {
    // Create pharmacy profile on first use
    pharmacy = await Pharmacy.create({ owner: req.user._id, name: req.user.name || "My Pharmacy", licensenumber: req.user.licenseNumber || "" , medicines: []});
  }

  pharmacy.medicines.push({ name, stock: parsedStock });
  await pharmacy.save();

  return res.status(201).json(new ApiResponse(201, pharmacy.medicines, "medicine added successfully"));
});

// 3. update stock
export const updatemedicine = asyncHandler(async (req, res) => {
  const { medicineid } = req.params;
  const { stock } = req.body;

  if (!mongoose.Types.ObjectId.isValid(medicineid)) {
    throw new ApiError(400, "invalid medicine id");
  }

  const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
  if (!pharmacy) throw new ApiError(404, "pharmacy not found");

  const medicine = pharmacy.medicines.id(medicineid);
  if (!medicine) throw new ApiError(404, "medicine not found");

  const parsedStock = Number.isFinite(Number(stock)) ? Number(stock) : medicine.stock;
  medicine.stock = parsedStock;
  await pharmacy.save();

  return res.json(new ApiResponse(200, medicine, "medicine stock updated"));
});

// 4. remove medicine
export const removemedicine = asyncHandler(async (req, res) => {
  const { medicineid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(medicineid)) {
    throw new ApiError(400, "invalid medicine id");
  }

  const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

  if (!pharmacy) throw new ApiError(404, "pharmacy not found");

  const med = pharmacy.medicines.id(medicineid);
  if (!med) throw new ApiError(404, "medicine not found");
  med.deleteOne();
  await pharmacy.save();

  return res.json(new ApiResponse(200, pharmacy.medicines, "medicine removed successfully"));
});

// 5. Get pharmacy orders
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ pharmacy: req.user._id })
    .populate("patient", "name email phone")
    .populate("doctor", "name specialization")
    .sort({ createdAt: -1 });

  return res.json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// 6. Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!["pending", "preparing", "completed", "cancelled"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await Order.findOne({
    _id: orderId,
    pharmacy: req.user._id
  });

  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  await order.save();

  return res.json(new ApiResponse(200, order, "Order status updated successfully"));
});

// 7. Get pharmacy dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const stats = {
    totalOrders: await Order.countDocuments({ pharmacy: req.user._id }),
    pending: await Order.countDocuments({ 
      pharmacy: req.user._id, 
      status: "pending" 
    }),
    preparing: await Order.countDocuments({ 
      pharmacy: req.user._id, 
      status: "preparing" 
    }),
    completed: await Order.countDocuments({ 
      pharmacy: req.user._id, 
      status: "completed" 
    }),
    todayOrders: await Order.countDocuments({ 
      pharmacy: req.user._id, 
      createdAt: { $gte: today, $lt: tomorrow } 
    })
  };

  return res.json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

// 8. Get low stock medicines
export const getLowStockMedicines = asyncHandler(async (req, res) => {
  const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
  if (!pharmacy) throw new ApiError(404, "Pharmacy not found");

  const lowStockMedicines = pharmacy.medicines.filter(
    medicine => medicine.stock <= medicine.minStock
  );

  return res.json(new ApiResponse(200, lowStockMedicines, "Low stock medicines fetched successfully"));
});

// 9. Create order from prescription
export const createOrderFromPrescription = asyncHandler(async (req, res) => {
  const { prescriptionId, patientAddress, deliveryType, priority } = req.body;

  // This would typically fetch prescription details and create an order
  // For now, we'll create a basic order structure
  const order = await Order.create({
    patient: req.body.patientId,
    doctor: req.body.doctorId,
    pharmacy: req.user._id,
    prescription: prescriptionId,
    patientName: req.body.patientName,
    patientPhone: req.body.patientPhone,
    patientAddress: patientAddress,
    doctorName: req.body.doctorName,
    prescriptionDate: new Date(),
    orderTime: new Date().toLocaleTimeString(),
    status: "pending",
    priority: priority || "medium",
    deliveryType: deliveryType || "pickup",
    medications: req.body.medications || [],
    totalAmount: req.body.totalAmount || 0,
    notes: req.body.notes
  });

  return res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});
