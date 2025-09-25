"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertTriangle, CheckCircle, Clock, Search, Thermometer } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { api } from "@/lib/api"

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState("")
  const [age, setAge] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  const [commonSymptoms] = useState([
    "Fever",
    "Headache",
    "Cough",
    "Sore throat",
    "Fatigue",
    "Nausea",
    "Chest pain",
    "Shortness of breath",
    "Dizziness",
    "Stomach pain",
    "Back pain",
    "Joint pain",
    "Skin rash",
    "Runny nose",
  ])

  const handleSymptomClick = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(
        symptoms
          .replace(symptom, "")
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|,\s*$/g, ""),
      )
    } else {
      setSymptoms(symptoms ? `${symptoms}, ${symptom}` : symptom)
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      setResults({
        possibleConditions: [
          {
            name: "Common Cold",
            probability: 75,
            description: "A viral infection of the upper respiratory tract",
            severity: "mild",
            recommendations: [
              "Get plenty of rest",
              "Stay hydrated",
              "Use over-the-counter pain relievers if needed",
              "Consider seeing a doctor if symptoms worsen",
            ],
          },
          {
            name: "Seasonal Allergies",
            probability: 60,
            description: "Allergic reaction to environmental allergens",
            severity: "mild",
            recommendations: [
              "Avoid known allergens",
              "Use antihistamines",
              "Keep windows closed during high pollen days",
              "Consider allergy testing",
            ],
          },
          {
            name: "Viral Infection",
            probability: 45,
            description: "General viral infection affecting multiple systems",
            severity: "moderate",
            recommendations: [
              "Monitor symptoms closely",
              "Rest and hydration",
              "Consult a healthcare provider",
              "Avoid contact with others to prevent spread",
            ],
          },
        ],
        urgency: "low",
        nextSteps:
          "Monitor symptoms for 24-48 hours. If symptoms worsen or persist, consider booking an appointment with a healthcare provider.",
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "mild":
        return "text-green-600 bg-green-50 border-green-200"
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "severe":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "medium":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <DashboardLayout userRole="patient" userName="User" currentPath="/patient/symptom-checker">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Symptom Checker</h1>
          <p className="text-muted-foreground">Get AI-powered insights about your symptoms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Describe Your Symptoms</span>
              </CardTitle>
              <CardDescription>Please provide detailed information about what you're experiencing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Current Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms in detail..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Common Symptoms (click to add)</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant={symptoms.includes(symptom) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleSymptomClick(symptom)}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="How long?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="few-hours">Few hours</SelectItem>
                        <SelectItem value="1-day">1 day</SelectItem>
                        <SelectItem value="2-3-days">2-3 days</SelectItem>
                        <SelectItem value="1-week">1 week</SelectItem>
                        <SelectItem value="more-week">More than a week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="How severe?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Thermometer className="h-5 w-5" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>AI-powered assessment of your symptoms</CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner size="lg" className="mb-4" />
                  <p className="text-muted-foreground">Analyzing your symptoms...</p>
                  <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  {/* Urgency Level */}
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50">
                    {getUrgencyIcon(results.urgency)}
                    <div>
                      <p className="font-medium">
                        Urgency Level: {results.urgency.charAt(0).toUpperCase() + results.urgency.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">{results.nextSteps}</p>
                    </div>
                  </div>

                  {/* Possible Conditions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Possible Conditions</h4>
                    {results.possibleConditions.map((condition, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{condition.name}</h5>
                          <div className="flex items-center space-x-2">
                            <Badge className={getSeverityColor(condition.severity)}>{condition.severity}</Badge>
                            <Badge variant="outline">{condition.probability}% match</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{condition.description}</p>
                        <div>
                          <p className="text-sm font-medium mb-2">Recommendations:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {condition.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="text-primary">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button className="flex-1">Book Appointment</Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Save Results
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Fill out the form to get AI-powered insights about your symptoms
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Medical Disclaimer</p>
                <p className="text-yellow-700">
                  This symptom checker is for informational purposes only and should not replace professional medical
                  advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
