"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Calendar, FileText, User, Package, Activity, Bell, Shield } from "lucide-react"
import { useTranslation } from "react-i18next"

export function Sidebar({ userRole, currentPath, isOpen = true, onNavigate, className }) {
  const { t } = useTranslation()
  const router = useRouter()

  const menuItems = {
    patient: [
      { icon: Home, label: t("dashboard"), path: "/patient/dashboard" },
      { icon: Calendar, label: t("book_appointment"), path: "/patient/book-appointment" },
      { icon: FileText, label: t("medical_records"), path: "/patient/medical-records" },
      { icon: Bell, label: t("medical_reminders"), path: "/patient/reminders" },
      { icon: Shield, label: t("insurance_schemes"), path: "/patient/insurance" },
      { icon: Activity, label: t("symptom_checker"), path: "/patient/symptom-checker" },
      { icon: User, label: t("profile"), path: "/patient/profile" },
    ],
    doctor: [
      { icon: Home, label: t("dashboard"), path: "/doctor/dashboard" },
      { icon: Calendar, label: t("appointments"), path: "/doctor/appointments" },
      { icon: FileText, label: t("prescriptions"), path: "/doctor/prescriptions" },
      { icon: User, label: t("profile"), path: "/doctor/profile" },
    ],
    pharmacy: [
      { icon: Home, label: t("dashboard"), path: "/pharmacy/dashboard" },
      { icon: Package, label: t("inventory"), path: "/pharmacy/inventory" },
      { icon: User, label: t("profile"), path: "/pharmacy/profile" },
    ],
  }

  const items = menuItems[userRole] || []

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      router.push(path)
    }
  }

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border w-64 min-h-screen transition-transform duration-300",
        !isOpen && "-translate-x-full md:translate-x-0",
        className,
      )}
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
          >
            <span className="font-bold text-sm" style={{ color: "#ffffff" }}>
              NC
            </span>
          </div>
          <span className="text-sidebar-foreground font-semibold">Nabha Care</span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.path

            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
