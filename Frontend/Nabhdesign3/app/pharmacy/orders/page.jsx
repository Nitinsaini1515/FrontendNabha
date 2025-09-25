"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Clock, Package, Search, Phone, MapPin, Eye, CheckCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function PharmacyOrdersPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [orders] = useState([
    {
      id: "ORD-001",
      patientName: "Patient 1",
      patientPhone: "+91 98765 43210",
      patientAddress: "123 Main Street, Sector 22, Chandigarh",
      doctorName: "Dr. Priya Sharma",
      prescriptionDate: "2024-01-15",
      orderTime: "10:30 AM",
      status: "pending",
      priority: "high",
      deliveryType: "pickup",
      medications: [
        { name: "Amlodipine 5mg", quantity: 30, price: 120, inStock: true },
        { name: "Metoprolol 25mg", quantity: 60, price: 180, inStock: true },
      ],
      totalAmount: 300,
      notes: "Patient has hypertension, ensure proper counseling about medication timing.",
    },
    {
      id: "ORD-002",
      patientName: "Sunita Devi",
      patientPhone: "+91 98765 43211",
      patientAddress: "456 Park Avenue, Sector 35, Chandigarh",
      doctorName: "Dr. Amit Singh",
      prescriptionDate: "2024-01-15",
      orderTime: "11:15 AM",
      status: "preparing",
      priority: "medium",
      deliveryType: "delivery",
      medications: [
        { name: "Metformin 500mg", quantity: 90, price: 150, inStock: true },
        { name: "Glimepiride 2mg", quantity: 30, price: 200, inStock: false },
      ],
      totalAmount: 350,
      notes: "Diabetic patient, provide dietary counseling materials.",
    },
    {
      id: "ORD-003",
      patientName: "Amit Singh",
      patientPhone: "+91 98765 43212",
      patientAddress: "789 Garden Road, Sector 18, Chandigarh",
      doctorName: "Dr. Sunita Kaur",
      prescriptionDate: "2024-01-15",
      orderTime: "09:45 AM",
      status: "completed",
      priority: "low",
      deliveryType: "pickup",
      medications: [{ name: "Paracetamol 500mg", quantity: 20, price: 40, inStock: true }],
      totalAmount: 40,
      notes: "For fever and pain relief.",
    },
    {
      id: "ORD-004",
      patientName: "Kavita Sharma",
      patientPhone: "+91 98765 43213",
      patientAddress: "321 Rose Street, Sector 28, Chandigarh",
      doctorName: "Dr. Gupta",
      prescriptionDate: "2024-01-15",
      orderTime: "02:20 PM",
      status: "pending",
      priority: "high",
      deliveryType: "delivery",
      medications: [
        { name: "Insulin Glargine", quantity: 5, price: 800, inStock: true },
        { name: "Metformin 1000mg", quantity: 60, price: 240, inStock: true },
      ],
      totalAmount: 1040,
      notes: "Diabetic patient requiring insulin. Ensure cold chain delivery.",
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const ordersByStatus = {
    all: filteredOrders,
    pending: filteredOrders.filter((o) => o.status === "pending"),
    preparing: filteredOrders.filter((o) => o.status === "preparing"),
    completed: filteredOrders.filter((o) => o.status === "completed"),
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log("Updating order status:", orderId, newStatus)
    // Handle status update logic
  }

  return (
    <DashboardLayout userRole="pharmacy" userName="MedPlus Pharmacy" currentPath="/pharmacy/orders">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("orders_management")}</h1>
          <p className="text-muted-foreground">{t("process_manage_prescription_orders")}</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search_patient_order_id")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_orders")}</SelectItem>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="preparing">{t("preparing")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              {t("all_orders")} ({ordersByStatus.all.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              {t("pending")} ({ordersByStatus.pending.length})
            </TabsTrigger>
            <TabsTrigger value="preparing">
              {t("preparing")} ({ordersByStatus.preparing.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {t("completed")} ({ordersByStatus.completed.length})
            </TabsTrigger>
          </TabsList>

          {Object.entries(ordersByStatus).map(([status, orderList]) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {orderList.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{order.id}</h3>
                            <Badge className={getPriorityColor(order.priority)}>
                              {t(`priority_${order.priority}`)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t("patient")}: {order.patientName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("doctor")}: {order.doctorName}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{order.orderTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{order.patientPhone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {order.deliveryType === "delivery" ? (
                                <MapPin className="h-3 w-3" />
                              ) : (
                                <Package className="h-3 w-3" />
                              )}
                              <span>{order.deliveryType === "delivery" ? t("home_delivery") : t("store_pickup")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{t(`order_status_${order.status}`)}</Badge>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">{t("medications")}:</p>
                      <div className="space-y-1">
                        {order.medications.map((med, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{med.name}</span>
                              <span className="text-muted-foreground">x{med.quantity}</span>
                              {!med.inStock && <Badge variant="destructive">{t("out_of_stock")}</Badge>}
                            </div>
                            <span>₹{med.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-semibold text-sm mt-2 pt-2 border-t">
                        <span>{t("total_amount")}:</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {t("view_details")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {t("order_details")} - {order.id}
                            </DialogTitle>
                            <DialogDescription>{t("complete_order_information_actions")}</DialogDescription>
                          </DialogHeader>

                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Patient Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">{t("patient_name")}</Label>
                                  <p className="text-sm">{selectedOrder.patientName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">{t("phone")}</Label>
                                  <p className="text-sm">{selectedOrder.patientPhone}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <Label className="text-sm font-medium">{t("address")}</Label>
                                  <p className="text-sm">{selectedOrder.patientAddress}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">{t("doctor")}</Label>
                                  <p className="text-sm">{selectedOrder.doctorName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">{t("delivery_type")}</Label>
                                  <p className="text-sm">
                                    {selectedOrder.deliveryType === "delivery" ? t("home_delivery") : t("store_pickup")}
                                  </p>
                                </div>
                              </div>

                              {/* Medications */}
                              <div>
                                <Label className="text-sm font-medium mb-2 block">{t("medications")}</Label>
                                <div className="space-y-2">
                                  {selectedOrder.medications.map((med, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                                      <div>
                                        <p className="font-medium">{med.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {t("quantity")}: {med.quantity}
                                        </p>
                                        {!med.inStock && (
                                          <Badge variant="destructive" className="mt-1">
                                            {t("out_of_stock")}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="font-semibold">₹{med.price}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Notes */}
                              <div>
                                <Label className="text-sm font-medium">{t("special_notes")}</Label>
                                <p className="text-sm mt-1">{selectedOrder.notes}</p>
                              </div>

                              {/* Actions */}
                              <div className="flex space-x-2">
                                {selectedOrder.status === "pending" && (
                                  <Button onClick={() => handleUpdateOrderStatus(selectedOrder.id, "preparing")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {t("start_preparing")}
                                  </Button>
                                )}
                                {selectedOrder.status === "preparing" && (
                                  <Button onClick={() => handleUpdateOrderStatus(selectedOrder.id, "completed")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {t("mark_complete")}
                                  </Button>
                                )}
                                <Button variant="outline" className="bg-transparent">
                                  <Phone className="h-4 w-4 mr-2" />
                                  {t("call_patient")}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {order.status === "pending" && (
                        <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, "preparing")}>
                          {t("start_preparing")}
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, "completed")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t("complete")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
