"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stethoscope, User, Pill, Globe, Heart, Shield, Clock } from "lucide-react"

const heroImages = [
  "/modern-hospital-building-with-nabha-care-signage.jpg",
  "/caring-doctor-examining-patient-in-bright-clinic.jpg",
  "/pharmacy-interior-with-medicine-shelves-and-pharma.jpg",
  "/medical-team-discussing-patient-care-in-hospital.jpg",
  "/patient-consultation-room-with-modern-medical-equi.jpg",
]

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [language, setLanguage] = useState("en")
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRoleSelection = (role: string) => {
    // Store selected role in localStorage for login/register pages
    localStorage.setItem("selectedRole", role)
    router.push("/login")
  }

  const translations = {
    en: {
      welcome: "Welcome to Nabha Care",
      subtitle: "Your Trusted Healthcare Partner",
      description: "Connecting patients, doctors, and pharmacies for better healthcare outcomes",
      selectRole: "Select Your Role",
      doctor: "I am a Doctor",
      patient: "I am a Patient",
      pharmacy: "I am a Pharmacy",
      doctorDesc: "Manage appointments, prescriptions, and patient care",
      patientDesc: "Book appointments, view medical records, and connect with healthcare providers",
      pharmacyDesc: "Update medicine availability and manage inventory for nearby clinics",
      features: "Why Choose Nabha Care?",
      feature1: "24/7 Healthcare Support",
      feature2: "Secure & Private",
      feature3: "Real-time Updates",
      feature1Desc: "Round-the-clock medical assistance and support",
      feature2Desc: "Your health data is protected with advanced security",
      feature3Desc: "Live updates on appointments and medicine availability",
    },
    hi: {
      welcome: "नाभा केयर में आपका स्वागत है",
      subtitle: "आपका विश्वसनीय स्वास्थ्य साथी",
      description: "बेहतर स्वास्थ्य परिणामों के लिए मरीजों, डॉक्टरों और फार्मेसियों को जोड़ना",
      selectRole: "अपनी भूमिका चुनें",
      doctor: "मैं एक डॉक्टर हूं",
      patient: "मैं एक मरीज हूं",
      pharmacy: "मैं एक फार्मेसी हूं",
      doctorDesc: "अपॉइंटमेंट, प्रिस्क्रिप्शन और मरीज की देखभाल का प्रबंधन करें",
      patientDesc: "अपॉइंटमेंट बुक करें, मेडिकल रिकॉर्ड देखें और स्वास्थ्य प्रदाताओं से जुड़ें",
      pharmacyDesc: "नजदीकी क्लीनिकों के लिए दवा की उपलब्धता और इन्वेंटरी अपडेट करें",
      features: "नाभा केयर क्यों चुनें?",
      feature1: "24/7 स्वास्थ्य सहायता",
      feature2: "सुरक्षित और निजी",
      feature3: "रियल-टाइम अपडेट",
      feature1Desc: "चौबीसों घंटे चिकित्सा सहायता और सहारा",
      feature2Desc: "आपका स्वास्थ्य डेटा उन्नत सुरक्षा के साथ सुरक्षित है",
      feature3Desc: "अपॉइंटमेंट और दवा की उपलब्धता पर लाइव अपडेट",
    },
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">NC</span>
          </div>
          <span className="text-xl font-bold text-foreground">Nabha Care</span>
        </div>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिंदी</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 transition-opacity duration-1000">
          <img
            src={heroImages[currentImageIndex] || "/placeholder.svg"}
            alt="Nabha Care Healthcare"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">{t.welcome}</h1>
          <p className="text-xl md:text-2xl mb-2 text-pretty">{t.subtitle}</p>
          <p className="text-lg opacity-90 text-pretty">{t.description}</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t.selectRole}</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleRoleSelection("doctor")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{t.doctor}</h3>
              <p className="text-muted-foreground mb-6 text-pretty">{t.doctorDesc}</p>
              <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleRoleSelection("patient")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <User className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{t.patient}</h3>
              <p className="text-muted-foreground mb-6 text-pretty">{t.patientDesc}</p>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleRoleSelection("pharmacy")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Pill className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{t.pharmacy}</h3>
              <p className="text-muted-foreground mb-6 text-pretty">{t.pharmacyDesc}</p>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Get Started</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t.features}</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-muted-foreground">{t.feature1}</h3>
              <p className="text-muted-foreground text-pretty">{t.feature1Desc}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-muted-foreground">{t.feature2}</h3>
              <p className="text-muted-foreground text-pretty">{t.feature2Desc}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-muted-foreground">{t.feature3}</h3>
              <p className="text-muted-foreground text-pretty">{t.feature3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">© 2024 Nabha Care. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
