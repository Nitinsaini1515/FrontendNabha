import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test function to verify API endpoints
async function testAPI() {
  try {
    console.log('🚀 Testing Nabha Care Backend API...\n');

    // Test 1: Get doctors list (public endpoint)
    console.log('1. Testing GET /users/doctors (public)...');
    try {
      const response = await axios.get(`${BASE_URL}/users/doctors`);
      console.log('✅ Success:', response.data.message);
      console.log('   Doctors found:', response.data.data.doctors.length);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    // Test 2: Register a test patient
    console.log('\n2. Testing POST /users/register...');
    const testPatient = {
      name: 'Test Patient',
      email: 'test@example.com',
      password: 'password123',
      role: 'patient',
      phone: '+91 98765 43210',
      age: 30,
      bloodGroup: 'O+'
    };

    try {
      const response = await axios.post(`${BASE_URL}/users/register`, testPatient);
      console.log('✅ Success:', response.data.message);
      console.log('   User ID:', response.data.data.user._id);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    // Test 3: Login test
    console.log('\n3. Testing POST /users/login...');
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Success:', response.data.message);
      console.log('   User role:', response.data.data.user.role);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API testing completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Test the frontend integration');
    console.log('3. Check the API_ENDPOINTS.md file for detailed documentation');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAPI();
