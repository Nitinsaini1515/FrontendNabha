"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, User, FileText, Activity, Video, MapPin, CheckCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"

export default function DoctorDashboard() {
  const { t } = useTranslation()

  const [doctor, setDoctor] = useState({
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: "15 years",
    rating: 4.8,
    totalPatients: 1250,
    consultationFee: 500,
  })

  const [isAvailable, setIsAvailable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [todayStats, setTodayStats] = useState({
    totalAppointments: 12,
    completed: 8,
    pending: 3,
    cancelled: 1,
  })

  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: 1,
      patientName: "Patient 1",
      patientAge: 35,
      time: "10:30 AM",
      type: "video",
      status: "completed",
      symptoms: "Chest pain, shortness of breath",
      duration: "30 min",
    },
    {
      id: 2,
      patientName: "Sunita Devi",
      patientAge: 45,
      time: "11:00 AM",
      type: "clinic",
      status: "in_progress",
      symptoms: "High blood pressure follow-up",
      duration: "20 min",
    },
    {
      id: 3,
      patientName: "Amit Singh",
      patientAge: 28,
      time: "11:30 AM",
      type: "video",
      status: "pending",
      symptoms: "Heart palpitations",
      duration: "30 min",
    },
    {
      id: 4,
      patientName: "Kavita Sharma",
      patientAge: 52,
      time: "2:00 PM",
      type: "clinic",
      status: "pending",
      symptoms: "Routine cardiac checkup",
      duration: "45 min",
    },
    {
      id: 5,
      patientName: "Ravi Gupta",
      patientAge: 38,
      time: "3:00 PM",
      type: "video",
      status: "pending",
      symptoms: "Chest discomfort after exercise",
      duration: "30 min",
    },
  ])

  const [recentActivities] = useState([
    {
      id: 1,
      type: "prescription",
      patient: "Patient 1",
      action: "Prescribed blood pressure medication",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "appointment",
      patient: "Sunita Devi",
      action: "Completed consultation",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "report",
      patient: "Amit Singh",
      action: "Reviewed lab reports",
      time: "5 hours ago",
    },
  ])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          window.location.href = '/login'
          return
        }

        // Load doctor data from localStorage first, then try API
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setDoctor(prev => ({ ...prev, ...userData }))
        }

        // Try to get updated doctor data from API
        try {
          const profileResponse = await api.getDoctorProfile(token)
          if (profileResponse.success && profileResponse.data.doctor) {
            setDoctor(profileResponse.data.doctor)
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(profileResponse.data.doctor))
          }
        } catch (profileError) {
          console.log('Using cached doctor data:', profileError.message)
        }

        // Load appointments from API
        try {
          const appointmentsResponse = await api.getDoctorAppointments(token)
          if (appointmentsResponse.success) {
            setTodayAppointments(appointmentsResponse.data.appointments || [])
            // Calculate stats from appointments
            const appointments = appointmentsResponse.data.appointments || []
            const stats = {
              totalAppointments: appointments.length,
              completed: appointments.filter(apt => apt.status === 'completed').length,
              pending: appointments.filter(apt => apt.status === 'pending').length,
              cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
            }
            setTodayStats(stats)
          }
        } catch (appointmentsError) {
          console.log('Using fallback appointment data:', appointmentsError.message)
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
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status) => {
    return t(`status_${status}`)
  }

  const handleStartConsultation = (appointmentId) => {
    console.log("Starting consultation for appointment:", appointmentId)
    // Handle start consultation logic
  }

  const handleCompleteAppointment = (appointmentId) => {
    console.log("Completing appointment:", appointmentId)
    // Handle complete appointment logic
  }

  return (
    <DashboardLayout userRole="doctor" userName={doctor.name} currentPath="/doctor/dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {t("good_morning_doctor")}, {doctor.name}!
              </h1>
              <p className="text-primary-foreground/80">
                {t("you_have")} {todayStats.pending} {t("appointments_pending_today")}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <Label htmlFor="availability" className="text-primary-foreground/80">
                  {t("available_consultations")}
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Switch
                    id="availability"
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                    className="data-[state=checked]:bg-white data-[state=checked]:text-primary"
                  />
                  <span className="text-sm font-medium">{isAvailable ? t("online") : t("offline")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("total_today")}</p>
                  <p className="text-2xl font-bold">{todayStats.totalAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("completed")}</p>
                  <p className="text-2xl font-bold text-green-600">{todayStats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("pending")}</p>
                  <p className="text-2xl font-bold text-yellow-600">{todayStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("total_patients")}</p>
                  <p className="text-2xl font-bold">{doctor.totalPatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{t("todays_appointments")}</span>
                </CardTitle>
                <CardDescription>{t("scheduled_consultations")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{appointment.patientName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t("age")}: {appointment.patientAge}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {appointment.time} ({appointment.duration})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {appointment.type === "video" ? (
                          <Video className="h-4 w-4 text-blue-500" />
                        ) : (
                          <MapPin className="h-4 w-4 text-green-500" />
                        )}
                        <span>{appointment.type === "video" ? t("video_call") : t("clinic_visit")}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>{t("symptoms")}:</strong> {appointment.symptoms}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      {appointment.status === "pending" && (
                        <Button size="sm" onClick={() => handleStartConsultation(appointment.id)}>
                          {appointment.type === "video" ? (
                            <>
                              <Video className="h-4 w-4 mr-2" />
                              {t("start_call")}
                            </>
                          ) : (
                            <>
                              <User className="h-4 w-4 mr-2" />
                              {t("start_consultation")}
                            </>
                          )}
                        </Button>
                      )}
                      {appointment.status === "in_progress" && (
                        <Button size="sm" onClick={() => handleCompleteAppointment(appointment.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t("complete")}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        {t("view_details")}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("quick_actions")}</CardTitle>
                <CardDescription>{t("common_tasks")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  {t("create_prescription")}
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("view_schedule")}
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Activity className="h-4 w-4 mr-2" />
                  {t("patient_reports")}
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  {t("update_profile")}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{t("recent_activity")}</CardTitle>
                <CardDescription>{t("your_latest_actions")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("patient")}: {activity.patient}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
