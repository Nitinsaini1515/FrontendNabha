# Nabha Care Backend API

A comprehensive MERN stack backend for the Nabha Care healthcare platform, supporting patients, doctors, and pharmacies with role-based access control.

## 🚀 Features

- **Role-based Authentication**: Patient, Doctor, and Pharmacy roles
- **Appointment Management**: Book, manage, and track appointments
- **Prescription System**: Create and manage prescriptions
- **Order Management**: Pharmacy order processing
- **Medical Records**: Upload and manage patient records
- **AI Symptom Checker**: OpenAI-powered symptom analysis
- **Dashboard Analytics**: Role-specific dashboard statistics

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key (for symptom checker)

## 🛠️ Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the Backend directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/nabha-care
   
   # JWT
   ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
   ACCESS_TOKEN_EXPIRY=7d
   
   # OpenAI (for symptom checker)
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   
   # Server
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

The server will be available at `http://localhost:5000`

### Health Check
```bash
GET http://localhost:5000/health
```

### Key Endpoints

#### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/doctors` - Get doctors list (public)

#### Patient Routes
- `GET /api/patient/dashboard/stats` - Dashboard statistics
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - Get appointments
- `POST /api/patient/symptom-checker` - AI symptom analysis

#### Doctor Routes
- `GET /api/doctor/dashboard/stats` - Dashboard statistics
- `GET /api/doctor/appointments` - Get appointments
- `POST /api/doctor/prescriptions` - Create prescription
- `PUT /api/doctor/appointments/:id/consultation` - Update consultation

#### Pharmacy Routes
- `GET /api/pharmacy/dashboard/stats` - Dashboard statistics
- `GET /api/pharmacy/orders` - Get orders
- `PUT /api/pharmacy/orders/:id/status` - Update order status
- `GET /api/pharmacy/medicines/low-stock` - Low stock alert

## 🧪 Testing

Run the test script to verify API functionality:
```bash
npm test
```

## 🗄️ Database Models

### User Model
Supports three roles with role-specific fields:
- **Patient**: age, bloodGroup
- **Doctor**: specialization, experience, degree, hospital, consultationFee
- **Pharmacy**: pharmacyName, pharmacyAddress, licenseNumber

### Appointment Model
Enhanced with consultation details, vital signs, and medical history.

### Prescription Model
Complete prescription management with medications array and pricing.

### Order Model
Pharmacy order processing with status tracking and delivery options.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS configuration
- Input validation and sanitization

## 🚀 Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Configure production MongoDB connection
3. **Build**: No build step required for Node.js
4. **Start**: `npm start`

## 📁 Project Structure

```
Backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Authentication & validation
│   └── utils/           # Helper utilities
├── start-server.js      # Server entry point
├── test-api.js          # API testing script
├── API_ENDPOINTS.md     # Detailed API documentation
└── package.json         # Dependencies and scripts
```

## 🔧 Configuration

### CORS Settings
Configure allowed origins in `.env`:
```env
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

### Database Connection
Supports both local and cloud MongoDB:
```env
# Local
MONGODB_URI=mongodb://localhost:27017/nabha-care

# Cloud (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nabha-care
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in `.env`

2. **JWT Token Issues**
   - Ensure `ACCESS_TOKEN_SECRET` is set
   - Check token expiration settings

3. **CORS Errors**
   - Verify `CORS_ORIGIN` matches frontend URL
   - Check credentials setting

4. **OpenAI API Errors**
   - Verify API key is valid
   - Check API quota and limits

## 📞 Support

For issues and questions:
1. Check the API documentation in `API_ENDPOINTS.md`
2. Run the test script to verify functionality
3. Check server logs for detailed error messages

## 🎯 Next Steps

1. **Frontend Integration**: Connect React frontend to these APIs
2. **File Upload**: Implement file upload for medical records
3. **Real-time Features**: Add WebSocket support for live updates
4. **Payment Integration**: Add payment processing for consultations
5. **Notifications**: Implement email/SMS notifications

---

**Built with ❤️ for Nabha Care Healthcare Platform**
