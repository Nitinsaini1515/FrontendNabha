"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"

export function DashboardLayout({ children, userRole, userName, currentPath }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const router = useRouter()

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang)
    // Here you would integrate with i18next
    console.log("Language changed to:", lang)
  }

  const handleLogout = () => {
    // Clear any stored user data/tokens here
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  const handleNavigate = (path) => {
    router.push(path)
    // Close mobile sidebar after navigation
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userRole={userRole}
        userName={userName}
        onLanguageChange={handleLanguageChange}
        currentLanguage={currentLanguage}
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <Sidebar
          userRole={userRole}
          currentPath={currentPath}
          isOpen={sidebarOpen}
          onNavigate={handleNavigate}
          className="hidden md:block"
        />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
            <Sidebar
              userRole={userRole}
              currentPath={currentPath}
              isOpen={sidebarOpen}
              onNavigate={handleNavigate}
              className="relative z-50"
            />
          </div>
        )}

        <main className="flex-1 p-6 bg-background text-foreground">{children}</main>
      </div>
    </div>
  )
}
