"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Plus, Search, Edit } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { useTranslation } from "react-i18next"

export default function PharmacyInventoryPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddingMedicine, setIsAddingMedicine] = useState(false)

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
    expiryDate: "",
    purchasePrice: "",
    sellingPrice: "",
    currentStock: "",
    minStock: "",
    description: "",
  })

  const [inventory] = useState([
    {
      id: 1,
      name: "Amlodipine 5mg",
      category: "Cardiovascular",
      manufacturer: "Sun Pharma",
      batchNumber: "AM2024001",
      expiryDate: "2025-12-31",
      purchasePrice: 3.5,
      sellingPrice: 4.0,
      currentStock: 150,
      minStock: 50,
      status: "in-stock",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Metformin 500mg",
      category: "Diabetes",
      manufacturer: "Cipla",
      batchNumber: "MF2024002",
      expiryDate: "2025-08-15",
      purchasePrice: 1.2,
      sellingPrice: 1.67,
      currentStock: 25,
      minStock: 100,
      status: "low-stock",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      manufacturer: "GSK",
      batchNumber: "PC2024003",
      expiryDate: "2026-03-20",
      purchasePrice: 1.5,
      sellingPrice: 2.0,
      currentStock: 500,
      minStock: 200,
      status: "in-stock",
      lastUpdated: "2024-01-15",
    },
    {
      id: 4,
      name: "Insulin Glargine",
      category: "Diabetes",
      manufacturer: "Sanofi",
      batchNumber: "IG2024004",
      expiryDate: "2024-06-30",
      purchasePrice: 120,
      sellingPrice: 160,
      currentStock: 3,
      minStock: 10,
      status: "critical",
      lastUpdated: "2024-01-13",
    },
    {
      id: 5,
      name: "Atorvastatin 20mg",
      category: "Cardiovascular",
      manufacturer: "Ranbaxy",
      batchNumber: "AT2024005",
      expiryDate: "2025-10-15",
      purchasePrice: 5.0,
      sellingPrice: 6.0,
      currentStock: 0,
      minStock: 30,
      status: "out-of-stock",
      lastUpdated: "2024-01-12",
    },
  ])

  const categories = ["all", "Cardiovascular", "Diabetes", "Pain Relief", "Antibiotics", "Vitamins"]

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 border-green-200"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "out-of-stock":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStockStatus = (currentStock, minStock) => {
    if (currentStock === 0) return "out-of-stock"
    if (currentStock <= minStock * 0.3) return "critical"
    if (currentStock <= minStock) return "low-stock"
    return "in-stock"
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const inventoryByStatus = {
    all: filteredInventory,
    "in-stock": filteredInventory.filter((item) => item.status === "in-stock"),
    "low-stock": filteredInventory.filter((item) => item.status === "low-stock"),
    critical: filteredInventory.filter((item) => item.status === "critical"),
    "out-of-stock": filteredInventory.filter((item) => item.status === "out-of-stock"),
  }

  const handleAddMedicine = (e) => {
    e.preventDefault()
    console.log("Adding medicine:", newMedicine)
    setIsAddingMedicine(false)
    // Reset form
    setNewMedicine({
      name: "",
      category: "",
      manufacturer: "",
      batchNumber: "",
      expiryDate: "",
      purchasePrice: "",
      sellingPrice: "",
      currentStock: "",
      minStock: "",
      description: "",
    })
  }

  return (
    <DashboardLayout userRole="pharmacy" userName="MedPlus Pharmacy" currentPath="/pharmacy/inventory">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("inventory_management")}</h1>
            <p className="text-muted-foreground">{t("manage_medicine_stock_inventory")}</p>
          </div>
          <Dialog open={isAddingMedicine} onOpenChange={setIsAddingMedicine}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("add_medicine")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("add_new_medicine")}</DialogTitle>
                <DialogDescription>{t("enter_medicine_details_inventory")}</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t("medicine_name")}</Label>
                    <Input
                      id="name"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">{t("category")}</Label>
                    <Select
                      value={newMedicine.category}
                      onValueChange={(value) => setNewMedicine({ ...newMedicine, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("select_category")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="manufacturer">{t("manufacturer")}</Label>
                    <Input
                      id="manufacturer"
                      value={newMedicine.manufacturer}
                      onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="batchNumber">{t("batch_number")}</Label>
                    <Input
                      id="batchNumber"
                      value={newMedicine.batchNumber}
                      onChange={(e) => setNewMedicine({ ...newMedicine, batchNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">{t("expiry_date")}</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={newMedicine.expiryDate}
                      onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchasePrice">{t("purchase_price")} (₹)</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      step="0.01"
                      value={newMedicine.purchasePrice}
                      onChange={(e) => setNewMedicine({ ...newMedicine, purchasePrice: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellingPrice">{t("selling_price")} (₹)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      step="0.01"
                      value={newMedicine.sellingPrice}
                      onChange={(e) => setNewMedicine({ ...newMedicine, sellingPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentStock">{t("current_stock")}</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={newMedicine.currentStock}
                      onChange={(e) => setNewMedicine({ ...newMedicine, currentStock: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock">{t("minimum_stock_level")}</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={newMedicine.minStock}
                      onChange={(e) => setNewMedicine({ ...newMedicine, minStock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">{t("add_medicine")}</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingMedicine(false)}>
                    {t("cancel")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search_medicines")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? t("all_categories") : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{inventory.length}</div>
              <div className="text-sm text-muted-foreground">{t("total_items")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {inventory.filter((item) => item.status === "in-stock").length}
              </div>
              <div className="text-sm text-muted-foreground">{t("in_stock")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {inventory.filter((item) => item.status === "low-stock").length}
              </div>
              <div className="text-sm text-muted-foreground">{t("low_stock")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {inventory.filter((item) => item.status === "critical" || item.status === "out-of-stock").length}
              </div>
              <div className="text-sm text-muted-foreground">{t("critical_out")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              {t("all")} ({inventoryByStatus.all.length})
            </TabsTrigger>
            <TabsTrigger value="in-stock">
              {t("in_stock")} ({inventoryByStatus["in-stock"].length})
            </TabsTrigger>
            <TabsTrigger value="low-stock">
              {t("low_stock")} ({inventoryByStatus["low-stock"].length})
            </TabsTrigger>
            <TabsTrigger value="critical">
              {t("critical")} ({inventoryByStatus.critical.length})
            </TabsTrigger>
            <TabsTrigger value="out-of-stock">
              {t("out_of_stock")} ({inventoryByStatus["out-of-stock"].length})
            </TabsTrigger>
          </TabsList>

          {Object.entries(inventoryByStatus).map(([status, itemList]) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {itemList.length === 0 ? (
                <EmptyState
                  title={t("no_items_found")}
                  description={t("no_medicines_match_criteria")}
                  action={
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setCategoryFilter("all")
                      }}
                    >
                      {t("clear_filters")}
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itemList.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription>{item.manufacturer}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {t(`stock_status_${item.status.replace("-", "_")}`)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">{t("category")}</Label>
                            <p>{item.category}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t("batch")}</Label>
                            <p>{item.batchNumber}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t("current_stock")}</Label>
                            <p className="font-semibold">{item.currentStock}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t("min_stock")}</Label>
                            <p>{item.minStock}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t("purchase_price")}</Label>
                            <p>₹{item.purchasePrice}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t("selling_price")}</Label>
                            <p className="font-semibold">₹{item.sellingPrice}</p>
                          </div>
                        </div>

                        <div className="text-sm">
                          <Label className="text-xs text-muted-foreground">{t("expiry_date")}</Label>
                          <p className={new Date(item.expiryDate) < new Date() ? "text-red-600" : ""}>
                            {item.expiryDate}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Edit className="h-3 w-3 mr-1" />
                            {t("edit")}
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Package className="h-3 w-3 mr-1" />
                            {t("reorder")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
