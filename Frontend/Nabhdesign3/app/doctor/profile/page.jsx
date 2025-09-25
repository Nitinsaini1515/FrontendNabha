"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, MapPin, GraduationCap, Award, Clock, Edit, Save, X } from "lucide-react"

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Dr. Priya Sharma",
    email: "priya.sharma@nabhcare.com",
    phone: "+91 98765 43210",
    specialization: "Cardiologist",
    subSpecialization: "Interventional Cardiology",
    experience: "15",
    qualification: "MBBS, MD (Cardiology), DM (Interventional Cardiology)",
    registrationNumber: "MCI-12345",
    hospitalAffiliation: "Heart Care Institute, Chandigarh",
    address: "Sector 32, Chandigarh, Punjab 160030",
    languages: ["English", "Hindi", "Punjabi"],
    about:
      "Experienced cardiologist with expertise in interventional procedures and preventive cardiology. Committed to providing comprehensive cardiac care with a patient-centered approach.",
  })

  const [availabilityData, setAvailabilityData] = useState({
    monday: { available: true, startTime: "09:00", endTime: "17:00" },
    tuesday: { available: true, startTime: "09:00", endTime: "17:00" },
    wednesday: { available: true, startTime: "09:00", endTime: "17:00" },
    thursday: { available: true, startTime: "09:00", endTime: "17:00" },
    friday: { available: true, startTime: "09:00", endTime: "17:00" },
    saturday: { available: true, startTime: "09:00", endTime: "13:00" },
    sunday: { available: false, startTime: "", endTime: "" },
  })

  const [achievements] = useState([
    {
      title: "Best Cardiologist Award",
      organization: "Punjab Medical Association",
      year: "2023",
      description: "Recognized for excellence in cardiac care and patient outcomes",
    },
    {
      title: "Research Publication",
      organization: "Indian Heart Journal",
      year: "2022",
      description: "Published research on minimally invasive cardiac procedures",
    },
    {
      title: "Fellowship Completion",
      organization: "American College of Cardiology",
      year: "2020",
      description: "Completed advanced fellowship in interventional cardiology",
    },
  ])

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData, availabilityData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  const updateAvailability = (day, field, value) => {
    setAvailabilityData({
      ...availabilityData,
      [day]: { ...availabilityData[day], [field]: value },
    })
  }

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  }

  return (
    <DashboardLayout userRole="doctor" userName={profileData.name} currentPath="/doctor/profile">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your professional information and availability</p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">Your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-background text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-background text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="languages" className="text-foreground">
                      Languages Spoken
                    </Label>
                    <Input
                      id="languages"
                      value={profileData.languages.join(", ")}
                      onChange={(e) =>
                        setProfileData({ ...profileData, languages: e.target.value.split(", ").filter(Boolean) })
                      }
                      disabled={!isEditing}
                      placeholder="English, Hindi, Punjabi"
                      className="bg-background text-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground">
                    Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10 bg-background text-foreground"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about" className="text-foreground">
                    About
                  </Label>
                  <Textarea
                    id="about"
                    value={profileData.about}
                    onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell patients about yourself and your approach to medicine..."
                    className="bg-background text-foreground"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <GraduationCap className="h-5 w-5" />
                  <span>Professional Information</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your medical qualifications and practice details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-foreground">
                      Primary Specialization
                    </Label>
                    <Select
                      value={profileData.specialization}
                      onValueChange={(value) => setProfileData({ ...profileData, specialization: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                        <SelectItem value="General Physician">General Physician</SelectItem>
                        <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                        <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                        <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                        <SelectItem value="Neurologist">Neurologist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subSpecialization" className="text-foreground">
                      Sub-specialization
                    </Label>
                    <Input
                      id="subSpecialization"
                      value={profileData.subSpecialization}
                      onChange={(e) => setProfileData({ ...profileData, subSpecialization: e.target.value })}
                      disabled={!isEditing}
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-foreground">
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profileData.experience}
                      onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                      disabled={!isEditing}
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-foreground">
                      Medical Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={profileData.registrationNumber}
                      onChange={(e) => setProfileData({ ...profileData, registrationNumber: e.target.value })}
                      disabled={!isEditing}
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalAffiliation" className="text-foreground">
                      Hospital/Clinic Affiliation
                    </Label>
                    <Input
                      id="hospitalAffiliation"
                      value={profileData.hospitalAffiliation}
                      onChange={(e) => setProfileData({ ...profileData, hospitalAffiliation: e.target.value })}
                      disabled={!isEditing}
                      className="bg-background text-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification" className="text-foreground">
                    Qualifications
                  </Label>
                  <Textarea
                    id="qualification"
                    value={profileData.qualification}
                    onChange={(e) => setProfileData({ ...profileData, qualification: e.target.value })}
                    disabled={!isEditing}
                    rows={2}
                    placeholder="MBBS, MD, DM, etc."
                    className="bg-background text-foreground"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Weekly Availability</span>
                </CardTitle>
                <CardDescription>Set your consultation hours for each day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(availabilityData).map(([day, schedule]) => (
                  <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-24">
                      <Label className="font-medium">{dayNames[day]}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={schedule.available}
                        onChange={(e) => updateAvailability(day, "available", e.target.checked)}
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <Label className="text-sm">Available</Label>
                    </div>
                    {schedule.available && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">From:</Label>
                          <Input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => updateAvailability(day, "startTime", e.target.value)}
                            disabled={!isEditing}
                            className="w-32"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">To:</Label>
                          <Input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => updateAvailability(day, "endTime", e.target.value)}
                            disabled={!isEditing}
                            className="w-32"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements & Recognition</span>
                </CardTitle>
                <CardDescription>Your professional achievements and awards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <Badge variant="outline">{achievement.year}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{achievement.organization}</p>
                    <p className="text-sm">{achievement.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
