# Hotel Booking System

An end-to-end luxury hotel booking and administration platform.

## Overview
The Hotel Booking System is a full-stack, responsive web application that allows users to seamlessly browse luxury hotels, view available rooms, and place bookings. It features a robust **Admin Panel** that provides administrators with the ability to manage users, hotels, rooms, and track real-time booking statuses. 

Designed with modern UI aesthetics and built on a highly scalable Spring Boot backend, this application provides a flawless experience for both guests and hotel managers.

## Tech Stack

### Frontend (`hotel-booking-ui`)
- **Framework**: React 18 built with Vite
- **Routing**: React Router DOM (v6)
- **State & Data Fetching**: TanStack React Query & Axios
- **Styling**: Tailwind CSS & Lucide React Icons
- **Notifications**: React Hot Toast

### Backend (`hotel-manager-api`)
- **Framework**: Java 17 & Spring Boot 3
- **Security**: Spring Security & JWT Authentication
- **Database Access**: Spring Data JPA
- **API Documentation**: Swagger / OpenAPI 3
- **Build Tool**: Maven

---

## Features

### 👤 Guest Features
- **Secure Authentication**: JWT-based login and registration.
- **Hotel Discovery**: Browse and search luxury hotels by city or keywords.
- **Room Availability**: View detailed room profiles, capacities, and pricing.
- **Booking Management**: Book rooms for specific dates, view "My Bookings" dashboard, and cancel pending reservations.
- **Reviews**: Read and write reviews for hotels after staying.
- **Profile Management**: Update user profile information.

### 🛡️ Admin Features
- **Admin Dashboard**: Centralized hub for platform analytics and management.
- **Hotel Management**: Full CRUD operations for creating, updating, and removing hotel properties.
- **Room Management**: Dynamic modal integration to add, edit, or delete rooms within specific hotels.
- **Booking Administration**: View all cross-platform bookings, approve/cancel reservations, and review booking revenues.
- **User Management**: Monitor registered users and manage their access rights.

---

## Architecture
The application follows a standard decoupled Client-Server architecture:
1. **Client Layer**: A React Single Page Application (SPA) that consumes RESTful APIs. It manages its own routing and uses React Query for intelligent caching and state management.
2. **API Layer**: A Spring Boot application exposing REST endpoints. It acts as the gateway to the database, enforcing business logic and validation.
3. **Security Layer**: Stateless JWT authentication intercepts incoming requests. Role-based Access Control (RBAC) restricts sensitive endpoints (e.g., `/admin/**`) to administrators only.
4. **Data Layer**: Relational database modeling using JPA/Hibernate to maintain referential integrity between Users, Hotels, Rooms, Bookings, and Reviews.

---

## API References
The backend API is fully documented using Swagger UI. Once the backend is running, you can access the interactive API documentation at:
> `http://localhost:8080/swagger-ui.html`

**Key Endpoint Groups:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /hotels` - Fetch paginated hotel records
- `GET /admin/bookings` - Admin view of all reservations
- `PUT /admin/rooms/{id}` - Admin room modification

---

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven (or use the provided wrapper)

### 1. Run the Backend
The backend application uses profile-based configurations (`dev`, `prod`) and relies on environment variables for sensitive data.

1. **Configure Environment Variables**:
   In the `hotel-manager-api` directory, create a `.env` file based on the provided example:
   ```bash
   cp .env.example .env
   # Edit the .env file with your actual database credentials and JWT Secret
   ```

2. **Start the Application**:
   By default, the application runs using the `dev` profile. It will load secrets from your environment:
   ```bash
   cd hotel-manager-api
   # Load environment variables (Linux/macOS)
   export $(grep -v '^#' .env | xargs) 
   
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   *(To run in production mode, use: `./mvnw spring-boot:run -Dspring-boot.run.profiles=prod`)*

   *The server will start on `http://localhost:8080`.*

### 2. Run the Frontend
Navigate to the UI folder, install the necessary dependencies, and spin up the Vite development server:
```bash
cd hotel-booking-ui
npm install
npm run dev
```
*The React application will be available at `http://localhost:3000`.*

---

## Sample

*(Add project screenshots here)*
- `![Home Page](./docs/home.png)`
- `![Admin Dashboard](./docs/admin.png)`
- `![Room Management Modal](./docs/room-management.png)`

---

## Learn
To learn more about the core technologies used in this project, check out:
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Tailwind CSS Customization](https://tailwindcss.com/docs)
- [TanStack Query (React Query)](https://tanstack.com/query/latest)

---

## Future Enhancements
- **Payment Gateway Integration**: Process real-time payments using Stripe or PayPal API.
- **Automated Notifications**: Send confirmation emails and SMS reminders to guests via Twilio/SendGrid.
- **Advanced Analytics**: Interactive charts and graphs in the Admin Dashboard for revenue tracking.
- **AI Recommendations**: Suggest hotels to users based on their search history and past bookings.
- **Multi-language Support (i18n)**: Enable the application to be accessible in multiple languages.