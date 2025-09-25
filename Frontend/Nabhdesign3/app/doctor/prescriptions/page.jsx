"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Plus, Search, Calendar, Pill, Upload, Download, Eye } from "lucide-react"

export default function DoctorPrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreatingPrescription, setIsCreatingPrescription] = useState(false)

  // New prescription form state
  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    patientAge: "",
    diagnosis: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    additionalInstructions: "",
    followUpDate: "",
  })

  const [existingPrescriptions] = useState([
    {
      id: 1,
      patientName: "Patient 1",
      patientAge: 35,
      date: "2024-01-15",
      diagnosis: "Hypertension",
      medications: [
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take with food",
        },
        {
          name: "Metoprolol",
          dosage: "25mg",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Take in morning and evening",
        },
      ],
      additionalInstructions: "Monitor blood pressure daily. Avoid excessive salt intake.",
      followUpDate: "2024-02-15",
      status: "active",
    },
    {
      id: 2,
      patientName: "Sunita Devi",
      patientAge: 45,
      date: "2024-01-14",
      diagnosis: "Diabetes Type 2",
      medications: [
        {
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          duration: "90 days",
          instructions: "Take with meals",
        },
      ],
      additionalInstructions: "Regular blood sugar monitoring. Follow diabetic diet.",
      followUpDate: "2024-04-14",
      status: "active",
    },
    {
      id: 3,
      patientName: "Amit Singh",
      patientAge: 28,
      date: "2024-01-12",
      diagnosis: "Anxiety",
      medications: [
        {
          name: "Sertraline",
          dosage: "50mg",
          frequency: "Once daily",
          duration: "60 days",
          instructions: "Take in the morning",
        },
      ],
      additionalInstructions: "Avoid alcohol. Practice relaxation techniques.",
      followUpDate: "2024-03-12",
      status: "completed",
    },
  ])

  const addMedication = () => {
    setNewPrescription({
      ...newPrescription,
      medications: [
        ...newPrescription.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    })
  }

  const removeMedication = (index) => {
    const updatedMedications = newPrescription.medications.filter((_, i) => i !== index)
    setNewPrescription({ ...newPrescription, medications: updatedMedications })
  }

  const updateMedication = (index, field, value) => {
    const updatedMedications = newPrescription.medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med,
    )
    setNewPrescription({ ...newPrescription, medications: updatedMedications })
  }

  const handleCreatePrescription = (e) => {
    e.preventDefault()
    console.log("Creating prescription:", newPrescription)
    setIsCreatingPrescription(false)
    // Reset form
    setNewPrescription({
      patientName: "",
      patientAge: "",
      diagnosis: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
      additionalInstructions: "",
      followUpDate: "",
    })
  }

  const filteredPrescriptions = existingPrescriptions.filter((prescription) =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <DashboardLayout userRole="doctor" userName="Dr. Priya Sharma" currentPath="/doctor/prescriptions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
            <p className="text-muted-foreground">Create and manage patient prescriptions</p>
          </div>
          <Dialog open={isCreatingPrescription} onOpenChange={setIsCreatingPrescription}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Prescription</DialogTitle>
                <DialogDescription>Fill in the prescription details for your patient</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreatePrescription} className="space-y-6">
                {/* Patient Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientName">Patient Name</Label>
                        <Input
                          id="patientName"
                          value={newPrescription.patientName}
                          onChange={(e) => setNewPrescription({ ...newPrescription, patientName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientAge">Age</Label>
                        <Input
                          id="patientAge"
                          type="number"
                          value={newPrescription.patientAge}
                          onChange={(e) => setNewPrescription({ ...newPrescription, patientAge: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Textarea
                        id="diagnosis"
                        value={newPrescription.diagnosis}
                        onChange={(e) => setNewPrescription({ ...newPrescription, diagnosis: e.target.value })}
                        placeholder="Enter diagnosis..."
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Medications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Medications</span>
                      <Button type="button" size="sm" onClick={addMedication}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medication
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {newPrescription.medications.map((medication, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Medication {index + 1}</h4>
                          {newPrescription.medications.length > 1 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => removeMedication(index)}>
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Medicine Name</Label>
                            <Input
                              value={medication.name}
                              onChange={(e) => updateMedication(index, "name", e.target.value)}
                              placeholder="e.g., Amlodipine"
                              required
                            />
                          </div>
                          <div>
                            <Label>Dosage</Label>
                            <Input
                              value={medication.dosage}
                              onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                              placeholder="e.g., 5mg"
                              required
                            />
                          </div>
                          <div>
                            <Label>Frequency</Label>
                            <Select
                              value={medication.frequency}
                              onValueChange={(value) => updateMedication(index, "frequency", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Once daily">Once daily</SelectItem>
                                <SelectItem value="Twice daily">Twice daily</SelectItem>
                                <SelectItem value="Three times daily">Three times daily</SelectItem>
                                <SelectItem value="Four times daily">Four times daily</SelectItem>
                                <SelectItem value="As needed">As needed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <Input
                              value={medication.duration}
                              onChange={(e) => updateMedication(index, "duration", e.target.value)}
                              placeholder="e.g., 30 days"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Special Instructions</Label>
                          <Input
                            value={medication.instructions}
                            onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                            placeholder="e.g., Take with food"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Additional Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="additionalInstructions">General Instructions</Label>
                      <Textarea
                        id="additionalInstructions"
                        value={newPrescription.additionalInstructions}
                        onChange={(e) =>
                          setNewPrescription({ ...newPrescription, additionalInstructions: e.target.value })
                        }
                        placeholder="Any additional instructions for the patient..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="followUpDate">Follow-up Date</Label>
                      <Input
                        id="followUpDate"
                        type="date"
                        value={newPrescription.followUpDate}
                        onChange={(e) => setNewPrescription({ ...newPrescription, followUpDate: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-2">
                  <Button type="submit">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Prescription
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreatingPrescription(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.patientName}</h3>
                      <p className="text-sm text-muted-foreground">Age: {prescription.patientAge}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{prescription.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Pill className="h-3 w-3" />
                          <span>{prescription.medications.length} medications</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(prescription.status)}>{prescription.status}</Badge>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
                  <p className="text-sm mt-1">{prescription.diagnosis}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Medications</p>
                  <div className="mt-2 space-y-2">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency} for{" "}
                        {med.duration}
                        {med.instructions && <span className="text-muted-foreground"> ({med.instructions})</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Send to Pharmacy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
