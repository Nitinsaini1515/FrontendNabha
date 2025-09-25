"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, User, Video, MapPin, Search, FileText, CheckCircle, MessageSquare, Phone } from "lucide-react"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"

export default function DoctorAppointmentsPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [consultationNotes, setConsultationNotes] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [treatment, setTreatment] = useState("")

  const appointments = [
    {
      id: 1,
      patientName: "Patient 1",
      patientAge: 35,
      patientPhone: "+91 98765 43210",
      patientEmail: "rajesh.kumar@email.com",
      date: "2024-01-15",
      time: "10:30 AM",
      type: "video",
      status: "completed",
      symptoms: "Chest pain, shortness of breath",
      duration: "30 min",
      medicalHistory: "Hypertension, previous heart surgery in 2020",
      currentMedications: "Amlodipine 5mg daily",
      allergies: "Penicillin",
      vitalSigns: {
        bloodPressure: "140/90",
        heartRate: "85 bpm",
        temperature: "98.6°F",
        weight: "75 kg",
      },
    },
    {
      id: 2,
      patientName: "Sunita Devi",
      patientAge: 45,
      patientPhone: "+91 98765 43211",
      patientEmail: "sunita.devi@email.com",
      date: "2024-01-15",
      time: "11:00 AM",
      type: "clinic",
      status: "in_progress",
      symptoms: "High blood pressure follow-up",
      duration: "20 min",
      medicalHistory: "Diabetes Type 2, Hypertension",
      currentMedications: "Metformin 500mg, Lisinopril 10mg",
      allergies: "None",
      vitalSigns: {
        bloodPressure: "150/95",
        heartRate: "78 bpm",
        temperature: "98.4°F",
        weight: "68 kg",
      },
    },
    {
      id: 3,
      patientName: "Amit Singh",
      patientAge: 28,
      patientPhone: "+91 98765 43212",
      patientEmail: "amit.singh@email.com",
      date: "2024-01-15",
      time: "11:30 AM",
      type: "video",
      status: "pending",
      symptoms: "Heart palpitations",
      duration: "30 min",
      medicalHistory: "No significant medical history",
      currentMedications: "None",
      allergies: "None",
      vitalSigns: null,
    },
  ]

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
    return t(`status_${status.replace("-", "_")}`)
  }

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCompleteConsultation = () => {
    console.log("Completing consultation:", {
      appointmentId: selectedAppointment.id,
      notes: consultationNotes,
      diagnosis,
      treatment,
    })
    // Handle completion logic
  }

  return (
    <DashboardLayout userRole="doctor" userName="Dr. Priya Sharma" currentPath="/doctor/appointments">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("appointments")}</h1>
          <p className="text-muted-foreground">{t("manage_patient_consultations")}</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search_appointments_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("age")}: {appointment.patientAge}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{appointment.patientPhone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {appointment.date} at {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("consultation_type")}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {appointment.type === "video" ? (
                        <Video className="h-4 w-4 text-blue-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {appointment.type === "video" ? t("video_call") : t("clinic_visit")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("duration")}</p>
                    <p className="text-sm mt-1">{appointment.duration}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground">{t("chief_complaint")}</p>
                  <p className="text-sm mt-1">{appointment.symptoms}</p>
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                        className="bg-transparent"
                        variant="outline"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {t("view_details")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {t("patient_consultation")} - {appointment.patientName}
                        </DialogTitle>
                        <DialogDescription>
                          {appointment.date} at {appointment.time} •{" "}
                          {appointment.type === "video" ? t("video_call") : t("clinic_visit")}
                        </DialogDescription>
                      </DialogHeader>

                      <Tabs defaultValue="patient-info" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="patient-info">{t("patient_info")}</TabsTrigger>
                          <TabsTrigger value="consultation">{t("consultation")}</TabsTrigger>
                          <TabsTrigger value="notes">{t("notes_diagnosis")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="patient-info" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">{t("patient_information")}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium">{t("name")}</Label>
                                  <p className="text-sm">{appointment.patientName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">{t("age")}</Label>
                                  <p className="text-sm">
                                    {appointment.patientAge} {t("years")}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">{t("phone")}</Label>
                                  <p className="text-sm">{appointment.patientPhone}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">{t("email")}</Label>
                                  <p className="text-sm">{appointment.patientEmail}</p>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">{t("medical_history")}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium">{t("medical_history")}</Label>
                                  <p className="text-sm">{appointment.medicalHistory}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">{t("current_medications")}</Label>
                                  <p className="text-sm">{appointment.currentMedications}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">{t("allergies")}</Label>
                                  <p className="text-sm">{appointment.allergies}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {appointment.vitalSigns && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">{t("vital_signs")}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium">{t("blood_pressure")}</p>
                                    <p className="text-lg font-bold text-primary">
                                      {appointment.vitalSigns.bloodPressure}
                                    </p>
                                  </div>
                                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium">{t("heart_rate")}</p>
                                    <p className="text-lg font-bold text-primary">{appointment.vitalSigns.heartRate}</p>
                                  </div>
                                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium">{t("temperature")}</p>
                                    <p className="text-lg font-bold text-primary">
                                      {appointment.vitalSigns.temperature}
                                    </p>
                                  </div>
                                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium">{t("weight")}</p>
                                    <p className="text-lg font-bold text-primary">{appointment.vitalSigns.weight}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </TabsContent>

                        <TabsContent value="consultation" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">{t("chief_complaint")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>{appointment.symptoms}</p>
                            </CardContent>
                          </Card>

                          <div className="flex space-x-2">
                            {appointment.type === "video" && (
                              <Button>
                                <Video className="h-4 w-4 mr-2" />
                                {t("start_video_call")}
                              </Button>
                            )}
                            <Button variant="outline" className="bg-transparent">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {t("send_message")}
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="notes" className="space-y-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="consultation-notes">{t("consultation_notes")}</Label>
                              <Textarea
                                id="consultation-notes"
                                placeholder={t("enter_consultation_notes")}
                                value={consultationNotes}
                                onChange={(e) => setConsultationNotes(e.target.value)}
                                rows={4}
                              />
                            </div>

                            <div>
                              <Label htmlFor="diagnosis">{t("diagnosis")}</Label>
                              <Textarea
                                id="diagnosis"
                                placeholder={t("enter_diagnosis")}
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                rows={3}
                              />
                            </div>

                            <div>
                              <Label htmlFor="treatment">{t("treatment_plan")}</Label>
                              <Textarea
                                id="treatment"
                                placeholder={t("enter_treatment_plan")}
                                value={treatment}
                                onChange={(e) => setTreatment(e.target.value)}
                                rows={3}
                              />
                            </div>

                            <div className="flex space-x-2">
                              <Button onClick={handleCompleteConsultation}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {t("complete_consultation")}
                              </Button>
                              <Button variant="outline" className="bg-transparent">
                                <FileText className="h-4 w-4 mr-2" />
                                {t("create_prescription")}
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>

                  {appointment.status === "pending" && (
                    <Button size="sm">
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
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("complete")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
