"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Shield, CheckCircle, Clock, FileText, Users, Heart, Baby, Eye } from "lucide-react"
import { api } from "@/lib/api"

export default function InsuranceSchemes() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      scheme: "Ayushman Bharat",
      status: "approved",
      appliedDate: "2024-01-15",
      coverage: "₹5,00,000",
    },
    {
      id: 2,
      scheme: "Punjab Health Insurance",
      status: "pending",
      appliedDate: "2024-02-20",
      coverage: "₹2,00,000",
    },
  ])

  const schemes = [
    {
      id: 1,
      name: "Ayushman Bharat (PM-JAY)",
      description: "Pradhan Mantri Jan Arogya Yojana provides health coverage up to ₹5 lakh per family per year",
      coverage: "₹5,00,000",
      eligibility: "BPL families, SECC database beneficiaries",
      benefits: ["Cashless treatment", "Pre and post hospitalization", "Day care procedures", "Emergency care"],
      icon: <Heart className="h-6 w-6" />,
      color: "bg-red-100 text-red-800",
    },
    {
      id: 2,
      name: "Punjab Health Insurance Scheme",
      description: "State government health insurance for Punjab residents",
      coverage: "₹2,00,000",
      eligibility: "Punjab residents with annual income below ₹1.8 lakh",
      benefits: ["Family coverage", "Maternity benefits", "Critical illness", "Ambulance services"],
      icon: <Shield className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 3,
      name: "Rashtriya Swasthya Bima Yojana (RSBY)",
      description: "Health insurance scheme for Below Poverty Line families",
      coverage: "₹30,000",
      eligibility: "BPL card holders",
      benefits: ["Hospitalization coverage", "Pre-existing diseases", "Transport allowance", "Maternity benefits"],
      icon: <Users className="h-6 w-6" />,
      color: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      name: "Janani Suraksha Yojana (JSY)",
      description: "Safe motherhood intervention under National Health Mission",
      coverage: "Cash assistance + free delivery",
      eligibility: "Pregnant women, especially from poor families",
      benefits: ["Cash assistance", "Free delivery", "Postnatal care", "Institutional delivery promotion"],
      icon: <Baby className="h-6 w-6" />,
      color: "bg-pink-100 text-pink-800",
    },
    {
      id: 5,
      name: "National Programme for Control of Blindness",
      description: "Free eye care and cataract surgery program",
      coverage: "Free treatment",
      eligibility: "All citizens, priority to BPL families",
      benefits: ["Free eye checkup", "Cataract surgery", "Spectacles", "Eye care awareness"],
      icon: <Eye className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-800",
    },
  ]

  const [selectedScheme, setSelectedScheme] = useState(null)
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = (scheme) => {
    setSelectedScheme(scheme)
    setIsApplying(true)
  }

  const submitApplication = () => {
    const newApplication = {
      id: Date.now(),
      scheme: selectedScheme.name,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
      coverage: selectedScheme.coverage,
    }
    setApplications([...applications, newApplication])
    setIsApplying(false)
    setSelectedScheme(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Government Insurance Schemes</h1>
          <p className="text-gray-600 mt-2">
            Explore and apply for government health insurance schemes available in Punjab
          </p>
        </div>

        <Tabs defaultValue="schemes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schemes">Available Schemes</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility Checker</TabsTrigger>
          </TabsList>

          <TabsContent value="schemes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schemes.map((scheme) => (
                <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${scheme.color}`}>{scheme.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{scheme.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          Coverage: {scheme.coverage}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{scheme.description}</p>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Eligibility:</h4>
                      <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {scheme.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full" onClick={() => handleApply(scheme)}>
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track your insurance scheme applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{application.scheme}</h3>
                        <p className="text-sm text-gray-600">Applied on: {application.appliedDate}</p>
                        <p className="text-sm text-gray-600">Coverage: {application.coverage}</p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Checker</CardTitle>
                <CardDescription>Check your eligibility for various government health schemes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="income">Annual Family Income</Label>
                    <Input id="income" placeholder="Enter annual income" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="General/SC/ST/OBC" />
                  </div>
                  <div>
                    <Label htmlFor="ration">Ration Card Type</Label>
                    <Input id="ration" placeholder="APL/BPL/AAY" />
                  </div>
                  <div>
                    <Label htmlFor="family">Family Size</Label>
                    <Input id="family" placeholder="Number of family members" />
                  </div>
                </div>
                <Button className="w-full">Check Eligibility</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Application Dialog */}
        <Dialog open={isApplying} onOpenChange={setIsApplying}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for {selectedScheme?.name}</DialogTitle>
              <DialogDescription>Please confirm your application for this government health scheme.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Scheme Details:</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedScheme?.description}</p>
                <p className="text-sm font-medium mt-2">Coverage: {selectedScheme?.coverage}</p>
              </div>
              <div className="space-y-2">
                <Label>Required Documents:</Label>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Aadhaar Card</li>
                  <li>• Ration Card</li>
                  <li>• Income Certificate</li>
                  <li>• Bank Account Details</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApplying(false)}>
                Cancel
              </Button>
              <Button onClick={submitApplication}>Submit Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
