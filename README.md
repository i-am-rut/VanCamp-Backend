# VanCamp Backend

## Introduction
VanCamp is a platform that enables users to explore, host, and rent camping vans with a seamless booking experience. The backend is built using **Node.js with Express** and **MongoDB**, providing secure authentication, van management, booking features, and payment processing.

---

## About
VanCamp aims to simplify the van rental experience by offering features such as dynamic pricing, availability management, user authentication, wish list functionality, and a host dashboard for managing earnings and bookings. This backend serves as the core of the platform, ensuring smooth data handling and business logic execution.

---

## Technologies Used
- **Backend Framework:** Node.js (Express.js)
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Token (JWT)
- **Cloud Storage:** Cloudinary (for van images and insurance documents)
- **Payment Gateway:** Razorpay (for secure transactions)
- **Hosting & Deployment:** Render (Backend API hosting)
- **Other Libraries:**
  - bcrypt.js (password hashing)
  - dotenv (environment variable management)
  - cors (Cross-Origin Resource Sharing)
  - multer (file upload handling)
  - moment.js (date handling)
  - express-validator (input validation)
  
---

## Project Structure
```
VanCamp-Backend/
│-- src/
│   ├── controllers/   # Business logic for each route
│   ├── models/        # Mongoose schema definitions
│   ├── routes/        # Express.js route handlers
│   ├── middleware/    # Authentication & error handling middleware
│   ├── config/        # Database & environment configuration
│   ├── utils/         # Utility functions (e.g., cloudinary, Razorpay setup)
│-- .env               # Environment variables (not included in repo)
│-- package.json       # Dependencies and scripts
│-- server.js          # Entry point of the application
```

---

## API Endpoints

### **Authentication**
- `POST /auth/register` - Register a new user
  **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "_id": "65a8b3c6e4b0b8d8dabc1234",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```
- `POST /auth/login` - Login and get JWT token
  **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "65a8b3c6e4b0b8d8dabc1234",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```
- `GET /auth/user` - Get authenticated user details

### **Van Management**
- `POST /vans/create` - Create a new van listing
  **Response:**
  ```json
  {
    "message": "Van created successfully",
    "van": {
      "_id": "65a8b3c6e4b0b8d8dabc5678",
      "title": "Cozy Camper",
      "location": "Los Angeles, CA",
      "pricePerDay": 80
    }
  }
  ```
- `GET /vans` - Get all available vans
- `GET /vans/:id` - Get details of a specific van
  **Response:**
  ```json
  {
    "_id": "65a8b3c6e4b0b8d8dabc5678",
    "title": "Cozy Camper",
    "description": "A comfortable camper van for road trips.",
    "image": "https://cloudinary.com/sample.jpg",
    "pricePerDay": 80,
    "location": "Los Angeles, CA",
    "host": "65a8b3c6e4b0b8d8dabc9999",
    "availability": ["2025-03-01", "2025-03-10"]
  }
  ```
- `DELETE /vans/:id` - Remove a van listing

### **Wishlist & Recommendations**
- `POST /wishlist/:vanId` - Add a van to wishlist
- `GET /wishlist` - Retrieve user’s wishlist
- `DELETE /wishlist/:vanId` - Remove a van from wishlist
- `GET /recommendations` - Fetch recommended vans based on preferences

### **Booking & Payments**
- `POST /booking/create` - Book a van
  **Response:**
  ```json
  {
    "message": "Booking successful",
    "booking": {
      "_id": "65a8b3c6e4b0b8d8dabc7777",
      "van": "65a8b3c6e4b0b8d8dabc5678",
      "user": "65a8b3c6e4b0b8d8dabc1234",
      "startDate": "2025-04-05",
      "endDate": "2025-04-12",
      "totalPrice": 560,
      "paymentStatus": "pending"
    }
  }
  ```
- `GET /booking/mybookings` - Retrieve user’s bookings
- `PATCH /booking/modify/:bookingId` - Modify an existing booking
- `POST /booking/cancel/:bookingId` - Cancel a booking
- `POST /transactions/create-order` - Process payment using Razorpay

### **Host Dashboard**
- `GET /host/dashboard` - Get host earnings, analytics, and booking data
- `PATCH /host/update-van/:id` - Update van details

---

## 🏛 Database Schema
### **User Schema**
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string",
  "location" : "string",
  "wishlist": ["ObjectId"],
  "role": "user" | "host"
}
```
### **Van Schema**
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "image": "string",
  "pricePerDay": "number",
  "location": "string",
  "host": "ObjectId",
  "hostName": "string",
  "availability": ["date"]
}
```
### **Booking Schema**
```json
{
  "_id": "ObjectId",
  "user": "ObjectId",
  "van": "ObjectId",
  "startDate": "date",
  "endDate": "date",
  "totalPrice": "number",
  "paymentStatus": "Pending" | "Completed" | "Cancelled" | "Completed"
}
```

---

## Architecture Diagram
Below is a high-level system architecture representation:
```
+-----------------+       +-----------------+       +-----------------+
|  Frontend (UI) | <---> | Backend (API)   | <---> | MongoDB Database |
+-----------------+       +-----------------+       +-----------------+
         |                      |                     |
         |                      |                     |
         v                      v                     v
+-----------------+      +-----------------+      +-----------------+
| Authentication  |      | Business Logic  |      |  Data Storage   |
| (JWT & bcrypt) |      | (Controllers)   |      | (Mongoose ORM)  |
+-----------------+      +-----------------+      +-----------------+
```

---

## Security Measures
- **JWT Authentication:** Secures API endpoints
- **Password Hashing:** All passwords are hashed using bcrypt.js
- **CORS Enabled:** Restricts access to allowed domains
- **Input Validation:** Prevents malicious data injection using express-validator
- **Environment Variables:** Sensitive keys are stored securely

---

## Deployment
The backend is deployed on **Render**.
- **Live API Base URL:** `https://vancamp-backend.onrender.com`

---

## Environment Variables (`.env`)
```env
PORT=5000
MONGO_URI=mongodb_uri
JWT_SECRET=jwt_secret
CLOUDINARY_CLOUD_NAME=cloudinary_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
RAZORPAY_KEY_ID=key_id
RAZORPAY_KEY_SECRET=key_secret
```

---

## How to Run Locally
```bash
# Clone the repository
git clone https://github.com/i-am-rut/vancamp-backend.git
cd vancamp-backend

# Install dependencies
npm install

# Create a .env file and configure it as shown above

# Start the server
npm run dev
```

---

## Future Enhancements
- WebSocket integration for real-time booking updates
- Admin dashboard for platform management
- AI-based van recommendations

---

## Contributor
- **Amrut Patil** - Developer

---

## 📄 License
This project is licensed under the **MIT License**.

