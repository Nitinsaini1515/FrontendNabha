"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, FileText, Activity, Phone, Video } from "lucide-react"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"

export default function PatientDashboard() {
  const { t } = useTranslation()
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentRecords, setRecentRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
          router.push('/login')
          return
        }

        // Load user data from localStorage first, then try API
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }

        // Try to get updated user data from API
        try {
          const profileResponse = await api.getPatientProfile(token)
          if (profileResponse.success && profileResponse.data.profile) {
            setUser(profileResponse.data.profile)
            // Update localStorage with fresh data
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(profileResponse.data.profile))
            }
          }
        } catch (profileError) {
          console.log('Using cached user data:', profileError.message)
        }

        // Load appointments and records from API
        const [appointmentsResponse, recordsResponse] = await Promise.all([
          api.getPatientAppointments(token),
          api.getMedicalRecords(token)
        ])

        if (appointmentsResponse.success) {
          setUpcomingAppointments(appointmentsResponse.data.appointments || [])
        }

        if (recordsResponse.success) {
          setRecentRecords(recordsResponse.data.records || [])
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Fallback to mock data if API fails - try to get name from stored user
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        const fallbackUser = {
          name: storedUser ? JSON.parse(storedUser).name || "Patient" : "Patient",
          age: 35,
          bloodGroup: "B+",
          phone: "+91 98765 43210",
          email: "user@email.com",
        }
        setUser(fallbackUser)
        setUpcomingAppointments([
          {
            id: 1,
            doctorName: "Dr. Priya Sharma",
            specialization: "Cardiologist",
            date: "2024-01-15",
            time: "10:30 AM",
            type: "video",
            status: "confirmed",
          }
        ])
        setRecentRecords([
          {
            id: 1,
            type: "Prescription",
            doctor: "Dr. Priya Sharma",
            date: "2024-01-10",
            title: "Blood Pressure Medication",
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router])

  const handleBookAppointment = () => {
    router.push("/patient/book-appointment")
  }

  const handleViewRecords = () => {
    router.push("/patient/medical-records")
  }

  const handleCheckSymptoms = () => {
    router.push("/patient/symptom-checker")
  }

  const handleUpdateProfile = () => {
    router.push("/patient/profile")
  }

  if (loading) {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const userName = storedUser ? JSON.parse(storedUser).name || "Patient" : "Patient"
    return (
      <DashboardLayout userRole="patient" userName={userName} currentPath="/patient/dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Get user name with better fallback
  const userName = user?.name || (() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    return storedUser ? JSON.parse(storedUser).name || "Patient" : "Patient"
  })()

  return (
    <DashboardLayout userRole="patient" userName={userName} currentPath="/patient/dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">
            {t("welcome")} , {userName}!
          </h1>
          <p className="text-primary-foreground/80">{t("health_summary")}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("upcoming_appointments")}</p>
                  <p className="font-semibold">{upcomingAppointments.length > 0 ? `${upcomingAppointments[0].date} ${upcomingAppointments[0].time}` : t("no_appointments")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("medical_records")}</p>
                  <p className="font-semibold">{recentRecords.length} {t("records")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{t("upcoming_appointments")}</span>
              </CardTitle>
              <CardDescription>{t("upcoming_appointments")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {appointment.type === "video" ? (
                      <Video className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Phone className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {appointment.date} at {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                    {t(`appointment_status_${appointment.status}`)}
                  </Badge>
                </div>
              ))}
              <Button className="w-full bg-transparent" variant="outline" onClick={handleBookAppointment}>
                <Calendar className="h-4 w-4 mr-2" />
                {t("book_appointment")}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Medical Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{t("recent_records")}</span>
              </CardTitle>
              <CardDescription>{t("recent_records")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{record.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("by")} {record.doctor}
                    </p>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                  <Badge variant="outline">{record.type}</Badge>
                </div>
              ))}
              <Button className="w-full bg-transparent" variant="outline" onClick={handleViewRecords}>
                <FileText className="h-4 w-4 mr-2" />
                {t("view_records")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("quick_actions")}</CardTitle>
            <CardDescription>{t("quick_actions")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col space-y-2" onClick={handleCheckSymptoms}>
                <Activity className="h-6 w-6" />
                <span>{t("check_symptoms")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={handleBookAppointment}
              >
                <Calendar className="h-6 w-6" />
                <span>{t("book_appointment")}</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={handleUpdateProfile}
              >
                <User className="h-6 w-6" />
                <span>
                  {t("update")} {t("profile")}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
