# Wheelio Platform - Project Report

## 1. Executive Summary
Wheelio is a modern, full-stack vehicle rental platform designed for high performance and scalability. This report details the transformation from a conceptual design to a professional, feature-rich application, covering the frontend architecture, backend logic, data persistence, security models, and DevOps automation.

## 2. Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite (for rapid development and optimized builds)
- **Styling**: Tailwind CSS 4 (for modern, utility-first UI design)
- **UI Components**: Shadcn/UI & Radix UI (for accessible, premium components)
- **Icons**: Lucide React & Material UI Icons
- **Maps**: React Leaflet (for location-based vehicle tracking)
- **Animations**: Motion (framer-motion)

### Backend
- **Framework**: Spring Boot 3.2.3 (Java 17)
- **Security**: Spring Security with JWT (JSON Web Token)
- **Database**: MongoDB (Primary persistence layer for users, vehicles, and bookings)
- **Mail**: Spring Boot Starter Mail (for automated booking & password reset notifications)

### DevOps & Infrastructure
- **CI/CD**: Jenkins (Automated pipeline via `Jenkinsfile`)
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

---

## 3. System Architecture

### Frontend Architecture
The frontend is built as a Single Page Application (SPA). It uses a modular component structure located in `src/app/components`.
- **Data Fetching**: Performed via a centralized `apiClient` (Axios) in `src/api/config.js`.
- **State Management**: Uses React Hooks (`useState`, `useEffect`) and LocalStorage for persistence of user sessions and tokens.
- **Interceptors**: Axios interceptors automatically attach JWT Bearer tokens to every outgoing request and handle 401 Unauthorized errors globally.

### Backend Architecture
The backend follows the standard Spring Boot layered architecture:
1. **Controller Layer**: REST Endpoints (e.g., `AuthController`, `VehicleController`).
2. **Service Layer**: Business logic implementation (e.g., `BookingService`, `DriverService`).
3. **Repository Layer**: Data access using `MongoRepository` for seamless MongoDB integration.
4. **Security Layer**: `JwtRequestFilter` validates tokens for every request.

---

## 4. Key Data Flows

### User Signup & Authentication
1. **Frontend**: User submits the signup form.
2. **Backend**: `AuthController` receives the request, encodes the password using `BCryptPasswordEncoder`, and saves the user to MongoDB.
3. **Persistence**: A new document is created in the `users` collection.
4. **Tokenization**: Upon successful signup/login, a JWT is generated and sent back to the frontend.

### Adding a New Vehicle
1. **Frontend**: Admin submits the vehicle form in the `AdminDashboard`.
2. **Backend**: `VehicleController.createVehicle` validates the payload.
3. **Persistence**: The vehicle is stored in the `vehicles` collection with fields like `brand`, `pricePerDay`, and `status`.

### Booking Process
- **Denormalization**: To ensure high performance, when a booking is created, a "Vehicle Summary" snapshot (denormalized data) is stored within the booking document. This prevents the need for complex joins later.
- **Workflow**: User selects vehicle → Uploads license (optional) → Confirms booking → Email notification is triggered.

---

## 5. Security & Access Control

Wheelio implements **Role-Based Access Control (RBAC)**:
- **USER**: Can browse vehicles, create bookings, and report damages.
- **DRIVER**: Can view assigned bookings and manage their driver profile.
- **ADMIN**: Full system access (Manage fleet, view all bookings, manage users).
- **STAFF**: Limited administrative access for operations.

---

## 6. Microservices vs. Unified Backend
While the project contains an archived microservices structure (`api-gateway`, `booking-service`, etc.), the current production-ready version is a **Unified Backend**. This approach was chosen to reduce deployment complexity and latency while remaining "Microservice-Ready" due to its modular service-repo boundaries.

---

## 7. DevOps & Deployment
- **Git**: Used for collaborative development and version branching.
- **Jenkins**: A multi-stage pipeline automates:
    - Code Checkout
    - Backend Build (Maven)
    - Frontend Build (NPM)
    - Artifact Archiving
- **Docker**: The entire platform is containerized. `docker-compose.yml` orchestrates the backend, frontend, MongoDB, and Postgres services in a single virtual network.

---

## 8. Conclusion
Wheelio represents a robust implementation of modern web standards. By combining an intuitive React frontend with a secured Spring Boot backend and automated CI/CD pipelines, the project delivers a professional-grade vehicle rental experience.
