"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, GraduationCap, Stethoscope, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import LanguageSwitcher from "@/components/language-switcher"
import { api } from "@/lib/api"

export default function RegisterPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    hospital: "",
    specialization: "",
    degree: "",
    experience: "",
    licenseNumber: "",
    pharmacyName: "",
    pharmacyAddress: "",
    pharmacyType: "",
    servicesOffered: "",
  })

  const isDoctorRole = () => {
    return ["general-practitioner", "specialist", "surgeon", "consultant"].includes(formData.role)
  }

  const isPharmacyRole = () => {
    return ["hospital-pharmacy", "retail-pharmacy", "clinical-pharmacy"].includes(formData.role)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert(t("passwords_dont_match"))
      return
    }

    if (!formData.role) {
      alert(t("select_role_error"))
      return
    }

    if (isDoctorRole()) {
      if (!formData.hospital || !formData.specialization || !formData.degree) {
        alert(t("fill_doctor_info"))
        return
      }
    }

    if (isPharmacyRole()) {
      if (!formData.pharmacyName || !formData.pharmacyAddress || !formData.licenseNumber) {
        alert(t("fill_pharmacy_info"))
        return
      }
    }

    setIsLoading(true)

    try {
      console.log("Registration attempt:", formData)

      // Prepare user data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role === "general-practitioner" || formData.role === "specialist" || 
              formData.role === "surgeon" || formData.role === "consultant" ? "doctor" : 
              formData.role === "hospital-pharmacy" || formData.role === "retail-pharmacy" || 
              formData.role === "clinical-pharmacy" ? "pharmacy" : "patient"
      };

      // Add role-specific data
      if (userData.role === "doctor") {
        userData.specialization = formData.specialization;
        userData.degree = formData.degree;
        userData.experience = formData.experience;
        userData.hospital = formData.hospital;
      } else if (userData.role === "pharmacy") {
        userData.pharmacyName = formData.pharmacyName;
        userData.pharmacyAddress = formData.pharmacyAddress;
        userData.licenseNumber = formData.licenseNumber;
      }

      // Make real API call to backend
      const response = await api.register(userData);
      
      if (response.success) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Navigate to appropriate dashboard based on role
        switch (userData.role) {
          case "doctor":
            router.push("/doctor/dashboard");
            break;
          case "pharmacy":
            router.push("/pharmacy/dashboard");
            break;
          default:
            router.push("/patient/dashboard");
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || t("registration_failed"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">NC</span>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">{t("join_nabha_care")}</CardTitle>
          <CardDescription>{t("create_account_description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("full_name")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t("enter_full_name")}
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("enter_email")}
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone_number")}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("enter_phone")}
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t("i_am_a")}</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t("select_role")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">{t("patient")}</SelectItem>
                  <SelectItem value="general-practitioner">{t("doctor_gp")}</SelectItem>
                  <SelectItem value="specialist">{t("doctor_specialist")}</SelectItem>
                  <SelectItem value="surgeon">{t("doctor_surgeon")}</SelectItem>
                  <SelectItem value="consultant">{t("doctor_consultant")}</SelectItem>
                  <SelectItem value="hospital-pharmacy">{t("pharmacy_hospital")}</SelectItem>
                  <SelectItem value="retail-pharmacy">{t("pharmacy_retail")}</SelectItem>
                  <SelectItem value="clinical-pharmacy">{t("pharmacy_clinical")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isDoctorRole() && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="hospital">{t("hospital_clinic")}</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={formData.hospital}
                      onValueChange={(value) => setFormData({ ...formData, hospital: value })}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder={t("select_hospital")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nabha-hospital">{t("nabha_hospital_preferred")}</SelectItem>
                        <SelectItem value="city-general">{t("city_general")}</SelectItem>
                        <SelectItem value="metro-clinic">{t("metro_clinic")}</SelectItem>
                        <SelectItem value="care-center">{t("care_center")}</SelectItem>
                        <SelectItem value="private-practice">{t("private_practice")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">{t("specialization")}</Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="specialization"
                      type="text"
                      placeholder={t("specialization_placeholder")}
                      className="pl-10"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">{t("medical_degree")}</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="degree"
                      type="text"
                      placeholder={t("degree_placeholder")}
                      className="pl-10"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">{t("years_experience")}</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder={t("experience_placeholder")}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    min="0"
                  />
                </div>
              </>
            )}

            {isPharmacyRole() && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pharmacyName">{t("pharmacy_name")}</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pharmacyName"
                      type="text"
                      placeholder={t("enter_pharmacy_name")}
                      className="pl-10"
                      value={formData.pharmacyName}
                      onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pharmacyAddress">{t("pharmacy_address")}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="pharmacyAddress"
                      placeholder={t("enter_pharmacy_address")}
                      className="pl-10 min-h-[80px]"
                      value={formData.pharmacyAddress}
                      onChange={(e) => setFormData({ ...formData, pharmacyAddress: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">{t("pharmacy_license")}</Label>
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder={t("enter_license_number")}
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">📋 {t("pharmacy_purpose_title")}</p>
                  <p className="text-xs text-blue-600 mt-1">{t("pharmacy_purpose_desc")}</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("create_password")}
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirm_password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("confirm_password_placeholder")}
                  className="pl-10 pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !formData.role}>
              {isLoading ? t("creating_account") : t("create_account")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("already_have_account")}{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                {t("sign_in")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
