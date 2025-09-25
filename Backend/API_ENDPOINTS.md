# Nabha Care Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a valid JWT token in cookies or Authorization header.

## API Endpoints

### Authentication Routes (`/api/users`)

#### Public Routes
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /doctors` - Get list of doctors (public)

#### Protected Routes
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Patient Routes (`/api/patient`)

#### Dashboard
- `GET /dashboard/stats` - Get patient dashboard statistics

#### Appointments
- `POST /appointments` - Book new appointment
- `GET /appointments` - Get patient appointments

#### Medical Records
- `GET /records` - Get patient medical records
- `POST /records` - Upload medical record

#### Other Services
- `POST /symptom-checker` - AI symptom analysis
- `GET /videos` - Get video library
- `GET /medicine/:name` - Search medicine availability

### Doctor Routes (`/api/doctor`)

#### Dashboard
- `GET /dashboard/stats` - Get doctor dashboard statistics

#### Appointments
- `GET /appointments` - Get doctor appointments
- `PUT /appointments/:appointmentid` - Update appointment status
- `PUT /appointments/:appointmentId/consultation` - Update consultation details

#### Prescriptions
- `POST /prescriptions` - Create prescription
- `GET /prescriptions` - Get doctor prescriptions

#### Patient Records
- `GET /records/:patientid` - Get patient medical records

#### Profile
- `PUT /availability` - Update doctor availability

### Pharmacy Routes (`/api/pharmacy`)

#### Dashboard
- `GET /dashboard/stats` - Get pharmacy dashboard statistics

#### Medicines
- `GET /medicines` - Get pharmacy medicines
- `POST /medicines` - Add new medicine
- `PUT /medicines/:medicineid` - Update medicine stock
- `DELETE /medicines/:medicineid` - Remove medicine
- `GET /medicines/low-stock` - Get low stock medicines

#### Orders
- `GET /orders` - Get pharmacy orders
- `PUT /orders/:orderId/status` - Update order status
- `POST /orders` - Create order from prescription

## Data Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: "patient" | "doctor" | "pharmacy",
  phone: String,
  address: String,
  
  // Patient fields
  age: Number,
  bloodGroup: String,
  
  // Doctor fields
  specialization: String,
  experience: String,
  degree: String,
  hospital: String,
  consultationFee: Number,
  rating: Number,
  totalPatients: Number,
  isAvailable: Boolean,
  
  // Pharmacy fields
  pharmacyName: String,
  pharmacyAddress: String,
  pharmacyType: String,
  servicesOffered: String,
  licenseNumber: String
}
```

### Appointment Model
```javascript
{
  patient: ObjectId,
  doctor: ObjectId,
  date: Date,
  time: String,
  type: "video" | "clinic",
  symptoms: String,
  duration: String,
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",
  medicalHistory: String,
  currentMedications: String,
  allergies: String,
  vitalSigns: {
    bloodPressure: String,
    heartRate: String,
    temperature: String,
    weight: String
  },
  consultationNotes: String,
  diagnosis: String,
  treatment: String
}
```

### Prescription Model
```javascript
{
  patient: ObjectId,
  doctor: ObjectId,
  appointment: ObjectId,
  diagnosis: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
    price: Number
  }],
  additionalInstructions: String,
  followUpDate: Date,
  status: "active" | "completed" | "expired",
  totalAmount: Number
}
```

### Order Model
```javascript
{
  orderId: String,
  patient: ObjectId,
  doctor: ObjectId,
  pharmacy: ObjectId,
  prescription: ObjectId,
  patientName: String,
  patientPhone: String,
  patientAddress: String,
  doctorName: String,
  prescriptionDate: Date,
  orderTime: String,
  status: "pending" | "preparing" | "completed" | "cancelled",
  priority: "high" | "medium" | "low",
  deliveryType: "pickup" | "delivery",
  medications: [{
    name: String,
    quantity: Number,
    price: Number,
    inStock: Boolean
  }],
  totalAmount: Number,
  notes: String
}
```

## Response Format

All API responses follow this format:

### Success Response
```javascript
{
  statusCode: 200,
  data: { /* response data */ },
  message: "Success message",
  success: true
}
```

### Error Response
```javascript
{
  statusCode: 400,
  data: null,
  message: "Error message",
  success: false,
  errors: [] // optional array of detailed errors
}
```

## Testing Examples

### Register Patient
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "password": "password123",
    "role": "patient",
    "phone": "+91 98765 43210",
    "age": 35,
    "bloodGroup": "B+"
  }'
```

### Book Appointment
```bash
curl -X POST http://localhost:5000/api/patient/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "doctorid": "doctor_id_here",
    "date": "2024-01-15",
    "time": "10:30 AM",
    "type": "video",
    "symptoms": "Chest pain, shortness of breath",
    "duration": "30 min"
  }'
```

### Create Prescription
```bash
curl -X POST http://localhost:5000/api/doctor/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "patientId": "patient_id_here",
    "appointmentId": "appointment_id_here",
    "diagnosis": "Hypertension",
    "medications": [
      {
        "name": "Amlodipine",
        "dosage": "5mg",
        "frequency": "Once daily",
        "duration": "30 days",
        "instructions": "Take with food",
        "price": 120
      }
    ],
    "additionalInstructions": "Monitor blood pressure daily",
    "followUpDate": "2024-02-15"
  }'
```
