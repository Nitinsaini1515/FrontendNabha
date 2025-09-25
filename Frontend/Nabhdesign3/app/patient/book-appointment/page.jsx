"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Video, Phone, MapPin } from "lucide-react"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"

export default function BookAppointmentPage() {
  const { t } = useTranslation()
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [symptoms, setSymptoms] = useState("")

  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data from localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }

        // Load doctors
        const response = await api.getDoctors()
        if (response.success) {
          setDoctors(response.data.doctors || [])
        } else {
          // Fallback to mock data
          setDoctors([
            {
              id: 1,
              name: "Dr. Priya Sharma",
              specialization: "Cardiologist",
              experience: "15 years",
              consultationFee: 0,
              location: "Nabha Hospital",
              availableSlots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
              image: "/caring-doctor.png",
            },
            {
              id: 2,
              name: "Dr. Amit Singh",
              specialization: "General Physician",
              experience: "12 years",
              consultationFee: 0,
              location: "Nabha Hospital",
              availableSlots: ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"],
              image: "/caring-doctor.png",
            }
          ])
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Use fallback data
        setDoctors([
          {
            id: 1,
            name: "Dr. Priya Sharma",
            specialization: "Cardiologist",
            experience: "15 years",
            consultationFee: 0,
            location: "Nabha Hospital",
            availableSlots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
            image: "/caring-doctor.png",
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleBookAppointment = async (e) => {
    e.preventDefault()
    
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentType) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const appointmentData = {
        doctorid: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        symptoms: symptoms,
        duration: "30 min" // Add duration as required by backend
      }

      const response = await api.bookAppointment(appointmentData, token)
      
      if (response.success) {
        alert(t("appointment_booked"))
        router.push("/patient/dashboard")
      } else {
        throw new Error(response.message || 'Failed to book appointment')
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert(error.message || "Failed to book appointment")
    }
  }

  return (
    <DashboardLayout userRole="patient" userName={user?.name || "User"} currentPath="/patient/book-appointment">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("book_appointment")}</h1>
          <p className="text-muted-foreground">{t("schedule_consultation")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("select_doctor")}</CardTitle>
                <CardDescription>{t("choose_specialists")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDoctor?.id === doctor.id ? "border-primary bg-primary/5" : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{doctor.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.experience} {t("experience")}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{doctor.location}</span>
                        </div>
                        <div className="flex items-center justify-end mt-3">
                          <div className="flex space-x-2">
                            <Badge variant="outline">
                              <Video className="h-3 w-3 mr-1" />
                              {t("video")}
                            </Badge>
                            <Badge variant="outline">
                              <Phone className="h-3 w-3 mr-1" />
                              {t("clinic")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Appointment Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("appointment_details")}</CardTitle>
                <CardDescription>{t("fill_appointment_info")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentType">{t("consultation_type")}</Label>
                    <Select value={appointmentType} onValueChange={setAppointmentType}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("select_consultation_type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <div className="flex items-center space-x-2">
                            <Video className="h-4 w-4" />
                            <span>{t("video")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="clinic">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{t("clinic")}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">{t("preferred_date")}</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">{t("preferred_time")}</Label>
                    <Input
                      id="time"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">{t("symptoms_reason")}</Label>
                    <Textarea
                      id="symptoms"
                      placeholder={t("describe_symptoms")}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {selectedDoctor && selectedDate && selectedTime && appointmentType && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">{t("appointment_summary")}</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>{t("doctor")}:</strong> {selectedDoctor.name}
                        </p>
                        <p>
                          <strong>{t("date")}:</strong> {selectedDate}
                        </p>
                        <p>
                          <strong>{t("time")}:</strong> {selectedTime}
                        </p>
                        <p>
                          <strong>{t("type")}:</strong>{" "}
                          {appointmentType === "video" ? t("video") : t("clinic")}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedDoctor || !selectedDate || !selectedTime || !appointmentType}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {t("book_appointment")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
