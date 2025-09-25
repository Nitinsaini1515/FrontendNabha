"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Search, Calendar, User } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"

export default function MedicalRecordsPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadMedicalRecords = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          window.location.href = '/login'
          return
        }

        // Load user data from localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }

        const response = await api.getMedicalRecords(token)
        if (response.success) {
          setRecords(response.data.records || [])
        } else {
          // Fallback to mock data
          setRecords([
            {
              id: 1,
              type: "prescription",
              title: "Blood Pressure Medication",
              doctor: "Dr. Priya Sharma",
              date: "2024-01-10",
              description: "Prescribed medication for hypertension management",
              fileUrl: "/sample-prescription.pdf",
              status: "active",
            },
            {
              id: 2,
              type: "lab-report",
              title: "Complete Blood Count",
              doctor: "Dr. Amit Singh",
              date: "2024-01-08",
              description: "Routine blood work analysis",
              fileUrl: "/sample-lab-report.pdf",
              status: "completed",
            }
          ])
        }
      } catch (error) {
        console.error('Error loading medical records:', error)
        // Use fallback data
        setRecords([
          {
            id: 1,
            type: "prescription",
            title: "Blood Pressure Medication",
            doctor: "Dr. Priya Sharma",
            date: "2024-01-10",
            description: "Prescribed medication for hypertension management",
            fileUrl: "/sample-prescription.pdf",
            status: "active",
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadMedicalRecords()
  }, [])

  const handleViewRecord = (record) => {
    // Open the file in a new tab for viewing
    window.open(record.fileUrl, "_blank")
  }

  const handleDownloadRecord = (record) => {
    // Create a temporary link to trigger download
    const link = document.createElement("a")
    link.href = record.fileUrl
    link.download = `${record.title.replace(/\s+/g, "_")}_${record.date}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getRecordIcon = (type) => {
    switch (type) {
      case "prescription":
        return "💊"
      case "lab-report":
        return "🧪"
      case "imaging":
        return "📷"
      case "consultation":
        return "👨‍⚕️"
      default:
        return "📄"
    }
  }

  const getRecordColor = (type) => {
    switch (type) {
      case "prescription":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "lab-report":
        return "bg-green-50 text-green-700 border-green-200"
      case "imaging":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "consultation":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || record.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const recordsByType = {
    all: filteredRecords,
    prescription: filteredRecords.filter((r) => r.type === "prescription"),
    "lab-report": filteredRecords.filter((r) => r.type === "lab-report"),
    imaging: filteredRecords.filter((r) => r.type === "imaging"),
    consultation: filteredRecords.filter((r) => r.type === "consultation"),
  }

  return (
    <DashboardLayout userRole="patient" userName={user?.name || "User"} currentPath="/patient/medical-records">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("medical_records")}</h1>
          <p className="text-muted-foreground">{t("view_download_history")}</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search_records")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                >
                  {t("all_records")}
                </Button>
                <Button
                  variant={selectedFilter === "prescription" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("prescription")}
                >
                  {t("prescriptions")}
                </Button>
                <Button
                  variant={selectedFilter === "lab-report" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("lab-report")}
                >
                  {t("lab_reports")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <EmptyState
              title="No records found"
              description="No medical records match your search criteria"
              action={
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${getRecordColor(record.type)}`}
                      >
                        {getRecordIcon(record.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{record.title}</h3>
                          <Badge variant={record.status === "active" ? "default" : "secondary"}>{record.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{record.doctor}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{record.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewRecord(record)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" onClick={() => handleDownloadRecord(record)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{records.length}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {records.filter((r) => r.type === "prescription").length}
              </div>
              <div className="text-sm text-muted-foreground">Prescriptions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {records.filter((r) => r.type === "lab-report").length}
              </div>
              <div className="text-sm text-muted-foreground">Lab Reports</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {records.filter((r) => r.type === "imaging").length}
              </div>
              <div className="text-sm text-muted-foreground">Imaging</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
