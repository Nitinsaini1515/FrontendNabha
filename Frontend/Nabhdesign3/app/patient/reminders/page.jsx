"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Clock, Pill, Calendar, Plus, Edit, Trash2 } from "lucide-react"
import { api } from "@/lib/api"

export default function MedicalReminders() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      type: "medication",
      title: "Blood Pressure Medicine",
      description: "Take Amlodipine 5mg",
      time: "08:00 AM",
      frequency: "Daily",
      nextDue: "Today",
      status: "active",
    },
    {
      id: 2,
      type: "appointment",
      title: "Cardiology Checkup",
      description: "Follow-up with Dr. Sharma",
      time: "02:00 PM",
      frequency: "Monthly",
      nextDue: "Tomorrow",
      status: "active",
    },
    {
      id: 3,
      type: "test",
      title: "Blood Sugar Test",
      description: "Check glucose levels",
      time: "07:00 AM",
      frequency: "Weekly",
      nextDue: "In 3 days",
      status: "active",
    },
  ])

  const [isAddingReminder, setIsAddingReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    type: "",
    title: "",
    description: "",
    time: "",
    frequency: "",
  })

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.time && newReminder.frequency) {
      const reminder = {
        id: Date.now(),
        ...newReminder,
        nextDue: "Today",
        status: "active",
      }
      setReminders([...reminders, reminder])
      setNewReminder({ type: "", title: "", description: "", time: "", frequency: "" })
      setIsAddingReminder(false)
    }
  }

  const handleDeleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "medication":
        return <Pill className="h-4 w-4" />
      case "appointment":
        return <Calendar className="h-4 w-4" />
      case "test":
        return <Clock className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "medication":
        return "bg-blue-100 text-blue-800"
      case "appointment":
        return "bg-green-100 text-green-800"
      case "test":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Reminders</h1>
            <p className="text-gray-600 mt-2">Manage your medication and appointment reminders</p>
          </div>
          <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Reminder</DialogTitle>
                <DialogDescription>
                  Create a new medical reminder to help you stay on track with your health.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newReminder.type}
                    onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="test">Medical Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="e.g., Blood Pressure Medicine"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    placeholder="Additional details..."
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newReminder.frequency}
                    onValueChange={(value) => setNewReminder({ ...newReminder, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingReminder(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddReminder}>Add Reminder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Active Reminders
            </CardTitle>
            <CardDescription>Your upcoming medical reminders and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getTypeColor(reminder.type)}`}>
                      {getTypeIcon(reminder.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{reminder.title}</h3>
                      <p className="text-sm text-gray-600">{reminder.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{reminder.time}</Badge>
                        <Badge variant="outline">{reminder.frequency}</Badge>
                        <Badge variant={reminder.nextDue === "Today" ? "default" : "secondary"}>
                          {reminder.nextDue}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteReminder(reminder.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medication Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">View your daily medication schedule</p>
              <Button variant="outline" className="w-full bg-transparent">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reminder History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Check your past reminder activities</p>
              <Button variant="outline" className="w-full bg-transparent">
                View History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Customize your reminder preferences</p>
              <Button variant="outline" className="w-full bg-transparent">
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
