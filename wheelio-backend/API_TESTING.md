# Wheelio Backend API Testing Guide

## Setup

**Backend URL:** http://localhost:8082

## 1. Health Check

```http
GET http://localhost:8082/api/health
```

**Expected Response:** `OK`

---

## 2. Authentication APIs

### Signup (Create New User)

```http
POST http://localhost:8082/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "role": "USER",
  "phone": "+91-9999999999"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "USER"
  }
}
```

### Login

```http
POST http://localhost:8082/api/auth/login
Content-Type: application/json

{
  "email": "user@wheelio.com",
  "password": "user123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "33333333-3333-3333-3333-333333333333",
    "email": "user@wheelio.com",
    "fullName": "Test User",
    "role": "USER"
  }
}
```

### Get Current User

```http
GET http://localhost:8082/api/auth/me
Authorization: Bearer <your-jwt-token>
```

---

## 3. Vehicle APIs

### Get All Vehicles

```http
GET http://localhost:8082/api/vehicles
```

### Get Vehicle by ID

```http
GET http://localhost:8082/api/vehicles/{id}
```

### Get Available Vehicles

```http
GET http://localhost:8082/api/vehicles/available
```

### Create Vehicle (Admin)

```http
POST http://localhost:8082/api/vehicles
Content-Type: application/json

{
  "name": "BMW X5",
  "brand": "BMW",
  "type": "SUV",
  "pricePerDay": 5000,
  "location": "Mumbai",
  "status": "AVAILABLE",
  "imageUrl": "/images/bmw-x5.jpg",
  "description": "Luxury SUV",
  "features": ["Sunroof", "Leather Seats", "GPS"]
}
```

---

## 4. Booking APIs

### Get All Bookings

```http
GET http://localhost:8082/api/bookings
```

### Get Booking by ID

```http
GET http://localhost:8082/api/bookings/{id}
```

### Get Bookings by User

```http
GET http://localhost:8082/api/bookings/user/{userId}
```

### Create Booking

```http
POST http://localhost:8082/api/bookings
Content-Type: application/json

{
  "userId": "33333333-3333-3333-3333-333333333333",
  "vehicleId": "vehicle-uuid-here",
  "startDate": "2026-02-15T10:00:00",
  "endDate": "2026-02-17T10:00:00",
  "totalAmount": 6000,
  "status": "PENDING",
  "paymentStatus": "PENDING"
}
```

---

## 5. Driver APIs

### Get All Drivers

```http
GET http://localhost:8082/api/drivers
```

### Get Available Drivers

```http
GET http://localhost:8082/api/drivers/available
```

### Get Driver Profile by User ID

```http
GET http://localhost:8082/api/drivers/user/{userId}
```

---

## 6. Payment APIs

### Create Payment

```http
POST http://localhost:8082/api/payments
Content-Type: application/json

{
  "bookingId": "booking-uuid-here",
  "amount": 6000,
  "method": "RAZORPAY",
  "razorpayOrderId": "order_xyz123",
  "razorpayPaymentId": "pay_abc456",
  "status": "SUCCESS"
}
```

---

## 7. Damage Report APIs

### Get All Damage Reports

```http
GET http://localhost:8082/api/damage-reports
```

### Get Reports by Vehicle

```http
GET http://localhost:8082/api/damage-reports/vehicle/{vehicleId}
```

### Create Damage Report

```http
POST http://localhost:8082/api/damage-reports
Content-Type: application/json

{
  "vehicleId": "vehicle-uuid-here",
  "reportedBy": "user-uuid-here",
  "description": "Scratches on front bumper",
  "severity": "LOW",
  "status": "OPEN",
  "images": ["https://example.com/image1.jpg"]
}
```

---

## Testing with cURL (PowerShell)

### Test Login

```powershell
Invoke-WebRequest -Uri "http://localhost:8082/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"user@wheelio.com","password":"user123"}' `
  -UseBasicParsing
```

### Test Get Vehicles

```powershell
Invoke-WebRequest -Uri "http://localhost:8082/api/vehicles" `
  -Method GET `
  -UseBasicParsing
```

---

## Test Users (from seed data)

| Email | Password | Role |
|-------|----------|------|
| admin@wheelio.com | admin123 | ADMIN |
| staff@wheelio.com | staff123 | STAFF |
| user@wheelio.com | user123 | USER |
| driver1@wheelio.com | driver123 | DRIVER |
| driver2@wheelio.com | driver123 | DRIVER |
| driver3@wheelio.com | driver123 | DRIVER |

---

## Testing in IntelliJ

1. **Open HTTP Client** (Tools → HTTP Client → Create Request in HTTP Client)
2. Copy any request from above
3. Click the green ▶️ button to execute
4. View response in the panel below
