"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Package, AlertTriangle, CheckCircle, Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"

export default function PharmacyDashboard() {
  const { t } = useTranslation()
  const router = useRouter()
  const [pharmacy, setPharmacy] = useState({
    name: "MedPlus Pharmacy",
    location: "Sector 17, Chandigarh",
    license: "PH-12345-CHD",
    rating: 4.6,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const [todayStats, setTodayStats] = useState({
    totalOrders: 24,
    pending: 8,
    completed: 14,
  })

  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      patientName: "Patient 1",
      doctorName: "Dr. Priya Sharma",
      prescriptionDate: "2024-01-15",
      orderTime: "10:30 AM",
      status: "pending",
      priority: "high",
      medications: [
        { name: "Amlodipine 5mg", quantity: 30, price: 120 },
        { name: "Metoprolol 25mg", quantity: 60, price: 180 },
      ],
      totalAmount: 300,
      patientPhone: "+91 98765 43210",
      deliveryType: "pickup",
    },
    {
      id: "ORD-002",
      patientName: "Sunita Devi",
      doctorName: "Dr. Amit Singh",
      prescriptionDate: "2024-01-15",
      orderTime: "11:15 AM",
      status: "preparing",
      priority: "medium",
      medications: [
        { name: "Metformin 500mg", quantity: 90, price: 150 },
        { name: "Glimepiride 2mg", quantity: 30, price: 200 },
      ],
      totalAmount: 350,
      patientPhone: "+91 98765 43211",
      deliveryType: "delivery",
    },
    {
      id: "ORD-003",
      patientName: "Amit Singh",
      doctorName: "Dr. Sunita Kaur",
      prescriptionDate: "2024-01-15",
      orderTime: "09:45 AM",
      status: "completed",
      priority: "low",
      medications: [{ name: "Paracetamol 500mg", quantity: 20, price: 40 }],
      totalAmount: 40,
      patientPhone: "+91 98765 43212",
      deliveryType: "pickup",
    },
    {
      id: "ORD-004",
      patientName: "Kavita Sharma",
      doctorName: "Dr. Gupta",
      prescriptionDate: "2024-01-15",
      orderTime: "02:20 PM",
      status: "pending",
      priority: "high",
      medications: [
        { name: "Insulin Glargine", quantity: 5, price: 800 },
        { name: "Metformin 1000mg", quantity: 60, price: 240 },
      ],
      totalAmount: 1040,
      patientPhone: "+91 98765 43213",
      deliveryType: "delivery",
    },
    {
      id: "ORD-005",
      patientName: "Ravi Gupta",
      doctorName: "Dr. Priya Sharma",
      prescriptionDate: "2024-01-14",
      orderTime: "04:30 PM",
      status: "completed",
      priority: "medium",
      medications: [
        { name: "Atorvastatin 20mg", quantity: 30, price: 180 },
        { name: "Aspirin 75mg", quantity: 30, price: 60 },
      ],
      totalAmount: 240,
      patientPhone: "+91 98765 43214",
      deliveryType: "pickup",
    },
  ])

  const [lowStockItems] = useState([
    { name: "Insulin Glargine", currentStock: 3, minStock: 10, price: 160 },
    { name: "Amlodipine 5mg", currentStock: 15, minStock: 50, price: 4 },
    { name: "Metformin 500mg", currentStock: 25, minStock: 100, price: 1.67 },
  ])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          window.location.href = '/login'
          return
        }

        // Load pharmacy data from localStorage first, then try API
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setPharmacy(prev => ({ ...prev, ...userData }))
        }

        // Try to get updated pharmacy data from API (mock returns { profile })
        try {
          const profileResponse = await api.getPharmacyProfile(token)
          if (profileResponse.success && profileResponse.data?.profile) {
            const profile = profileResponse.data.profile
            setPharmacy(prev => ({ ...prev, ...profile }))
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(profile))
          }
        } catch (profileError) {
          console.log('Using cached pharmacy data:', profileError?.message || profileError)
        }

        // Load orders from API
        try {
          const ordersResponse = await api.getPharmacyOrders(token)
          if (ordersResponse.success) {
            const apiOrders = ordersResponse.data?.orders || []
            setOrders(apiOrders)
            // Calculate stats from orders
            const stats = {
              totalOrders: apiOrders.length,
              pending: apiOrders.filter(order => order.status === 'pending').length,
              completed: apiOrders.filter(order => order.status === 'completed').length,
            }
            setTodayStats(stats)
          }
        } catch (ordersError) {
          console.log('Using fallback order data:', ordersError?.message || ordersError)
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

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

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log("Updating order status:", orderId, newStatus)
    // In a real app, this would make an API call
    alert(`Order ${orderId} status updated to ${newStatus}`)
    // Optionally refresh the page or update state
  }

  const handleViewOrderDetails = (orderId) => {
    router.push(`/pharmacy/orders/${orderId}`)
  }

  const handleReorder = (itemName) => {
    router.push(`/pharmacy/inventory?reorder=${encodeURIComponent(itemName)}`)
  }

  return (
    <DashboardLayout userRole="pharmacy" userName={pharmacy.name} currentPath="/pharmacy/dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {t("welcome")} {t("to")} {pharmacy.name}!
              </h1>
              <p className="text-primary-foreground/80">{t("manage_medicine_availability")}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{todayStats.pending}</div>
              <div className="text-primary-foreground/80">{t("stock_updates_pending")}</div>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("medicines_in_stock")}</p>
                  <p className="text-2xl font-bold">{todayStats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("updates_pending")}</p>
                  <p className="text-2xl font-bold text-yellow-600">{todayStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("updated_today")}</p>
                  <p className="text-2xl font-bold text-green-600">{todayStats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medicine Availability Updates */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>{t("medicine_availability_updates")}</span>
                </CardTitle>
                <CardDescription>{t("update_medicine_stock_clinics")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("search_medicine_name")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all_medicines")}</SelectItem>
                      <SelectItem value="pending">{t("need_update")}</SelectItem>
                      <SelectItem value="updated">{t("recently_updated")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Medicine List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{order.medications[0]?.name || t("medicine_name")}</h4>
                            <Badge className={getPriorityColor(order.priority)}>
                              {t(`priority_${order.priority}`)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t("stock")}: {order.medications[0]?.quantity || 0} {t("units")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("last_updated")}: {order.orderTime}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status === "completed" ? "updated" : "pending")}>
                          {order.status === "completed" ? t("updated") : t("needs_update")}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, "completed")}>
                          {t("update_stock")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => handleViewOrderDetails(order.id)}
                        >
                          {t("view_details")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>{t("low_stock_alert")}</span>
                </CardTitle>
                <CardDescription>{t("items_running_low")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.currentStock} {t("left")} ({t("min")}: {item.minStock})
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => handleReorder(item.name)}
                    >
                      {t("update")}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("quick_actions")}</CardTitle>
                <CardDescription>{t("medicine_management")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={() => router.push("/pharmacy/inventory")}>
                  <Package className="h-4 w-4 mr-2" />
                  {t("update_medicine_stock")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/pharmacy/inventory")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {t("add_new_medicine")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
