"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Store, Phone, Mail, MapPin, Clock, Award, Edit, Save, X } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function PharmacyProfilePage() {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "MedPlus Pharmacy",
    ownerName: "Pharmacy Owner",
    email: "contact@medpluspharmacy.com",
    phone: "+91 98765 43210",
    address: "Shop No. 15, Sector 17, Chandigarh, Punjab 160017",
    licenseNumber: "PH-12345-CHD",
    gstNumber: "03ABCDE1234F1Z5",
    establishedYear: "2010",
    description:
      "MedPlus Pharmacy is a trusted healthcare partner providing quality medicines and healthcare products. We are committed to serving our community with reliable pharmaceutical services and expert guidance.",
    services: ["Prescription Medicines", "OTC Drugs", "Health Supplements", "Medical Devices", "Home Delivery"],
    operatingHours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "22:00" },
      saturday: { open: "08:00", close: "22:00" },
      sunday: { open: "09:00", close: "21:00" },
    },
  })

  const [statistics] = useState({
    totalOrders: 2450,
    monthlyOrders: 185,
    rating: 4.6,
    reviewsCount: 128,
    yearsInBusiness: 14,
    customerSatisfaction: 94,
  })

  const [certifications] = useState([
    {
      title: "Pharmacy License",
      issuedBy: "Punjab State Pharmacy Council",
      issueDate: "2010-03-15",
      expiryDate: "2025-03-14",
      status: "active",
    },
    {
      title: "Drug License",
      issuedBy: "Drug Control Department, Punjab",
      issueDate: "2010-04-01",
      expiryDate: "2025-03-31",
      status: "active",
    },
    {
      title: "GST Registration",
      issuedBy: "GST Department",
      issueDate: "2017-07-01",
      expiryDate: "N/A",
      status: "active",
    },
  ])

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  const updateOperatingHours = (day, field, value) => {
    setProfileData({
      ...profileData,
      operatingHours: {
        ...profileData.operatingHours,
        [day]: { ...profileData.operatingHours[day], [field]: value },
      },
    })
  }

  const dayNames = {
    monday: t("monday"),
    tuesday: t("tuesday"),
    wednesday: t("wednesday"),
    thursday: t("thursday"),
    friday: t("friday"),
    saturday: t("saturday"),
    sunday: t("sunday"),
  }

  return (
    <DashboardLayout userRole="pharmacy" userName={profileData.name} currentPath="/pharmacy/profile">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("pharmacy_profile")}</h1>
            <p className="text-muted-foreground">{t("manage_pharmacy_information_settings")}</p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  {t("cancel")}
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  {t("save_changes")}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                {t("edit_profile")}
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{statistics.yearsInBusiness}</div>
              <div className="text-sm text-muted-foreground">{t("years_in_business")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{profileData.services.length}</div>
              <div className="text-sm text-muted-foreground">{t("services_offered")}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">{t("basic_info")}</TabsTrigger>
            <TabsTrigger value="hours">{t("operating_hours")}</TabsTrigger>
            <TabsTrigger value="services">{t("services")}</TabsTrigger>
            <TabsTrigger value="certifications">{t("certifications")}</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>{t("pharmacy_information")}</span>
                </CardTitle>
                <CardDescription>{t("basic_details_pharmacy")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("pharmacy_name")}</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">{t("owner_name")}</Label>
                    <Input
                      id="ownerName"
                      value={profileData.ownerName}
                      onChange={(e) => setProfileData({ ...profileData, ownerName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone_number")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">{t("license_number")}</Label>
                    <Input
                      id="licenseNumber"
                      value={profileData.licenseNumber}
                      onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">{t("gst_number")}</Label>
                    <Input
                      id="gstNumber"
                      value={profileData.gstNumber}
                      onChange={(e) => setProfileData({ ...profileData, gstNumber: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">{t("established_year")}</Label>
                    <Input
                      id="establishedYear"
                      value={profileData.establishedYear}
                      onChange={(e) => setProfileData({ ...profileData, establishedYear: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t("address")}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea
                    id="description"
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    placeholder={t("describe_pharmacy_services")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{t("operating_hours")}</span>
                </CardTitle>
                <CardDescription>{t("set_pharmacy_operating_hours")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(profileData.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-24">
                      <Label className="font-medium">{dayNames[day]}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">{t("open")}:</Label>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateOperatingHours(day, "open", e.target.value)}
                        disabled={!isEditing}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">{t("close")}:</Label>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateOperatingHours(day, "close", e.target.value)}
                        disabled={!isEditing}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("services_offered")}</CardTitle>
                <CardDescription>{t("medicine_availability_stock_management")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Badge variant="secondary">{service}</Badge>
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-4">
                    <Label>{t("add_edit_services")}</Label>
                    <Input
                      placeholder={t("enter_services_comma_separated")}
                      value={profileData.services.join(", ")}
                      onChange={(e) =>
                        setProfileData({ ...profileData, services: e.target.value.split(", ").filter(Boolean) })
                      }
                    />
                  </div>
                )}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">📋 {t("primary_focus_medicine_availability")}</p>
                  <p className="text-xs text-blue-600 mt-1">{t("pharmacy_provides_realtime_stock_updates")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>{t("licenses_certifications")}</span>
                </CardTitle>
                <CardDescription>{t("pharmacy_licenses_certifications")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{cert.title}</h4>
                      <Badge variant={cert.status === "active" ? "default" : "secondary"}>
                        {t(`certification_status_${cert.status}`)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div>
                        <Label className="text-xs">{t("issued_by")}</Label>
                        <p>{cert.issuedBy}</p>
                      </div>
                      <div>
                        <Label className="text-xs">{t("issue_date")}</Label>
                        <p>{cert.issueDate}</p>
                      </div>
                      <div>
                        <Label className="text-xs">{t("expiry_date")}</Label>
                        <p
                          className={
                            cert.expiryDate !== "N/A" && new Date(cert.expiryDate) < new Date() ? "text-red-600" : ""
                          }
                        >
                          {cert.expiryDate}
                        </p>
                      </div>
                    </div>
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
