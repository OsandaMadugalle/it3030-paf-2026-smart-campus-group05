# Smart Campus Operations Hub

**IT3030 – Programming Applications and Frameworks**  
**Group 05 | Semester 1, 2026 | Faculty of Computing – SLIIT**

---

## Team Members

| Member | Name | Student ID | GitHub | Module |
|--------|------|------------|--------|--------|
| Member 1 | Manuth | IT21000001 | [@ManuthJaya2003](https://github.com/ManuthJaya2003) | Facilities & Assets Catalogue |
| Member 2 | Shazra | IT21000002 | [@shazraHallaj12](https://github.com/shazraHallaj12) | Booking Management |
| Member 3 | Lihini | IT21000003 | [@lashi10976-git](https://github.com/lashi10976-git) | Incident Ticket Management |
| Member 4 | Osanda | IT21000004 | [@OsandaMadugalle](https://github.com/OsandaMadugalle) | Notifications + Auth + Roles |

---

## 🏗️ Architecture & Real-time Integration

The Smart Campus hub is built on a distributed event-driven architecture to ensure low-latency updates for campus operations.

### **WebSocket Events (Live Data)**
The system uses **STOMP over SockJS** for real-time data streaming.
- **Global Activity**: `/topic/activities` (Live alerts)
- **Booking Updates**: `/topic/bookings` (Instant availability changes)
- **Personal Alerts**: `/user/queue/notifications` (Targeted user notifications)

### **AI-Powered Services**
- **LLM Engine**: Groq API (Llama 3.3 70B)
- **Capabilities**: Natural language facility discovery, automated incident severity scoring, and smart notification timing based on user behavior patterns.

---

## 🛠️ Advanced Setup & Configuration

A production-inspired Smart Campus Operations Hub for a university to manage facility bookings, incident reporting, and campus notifications. Built with Spring Boot REST API and React client web application.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 3.2, Java 17 |
| Frontend | React 18, Tailwind CSS |
| Database | MongoDB Atlas |
| Real-time | WebSocket (STOMP + SockJS) |
| AI Integration | Groq API (Llama 3 / Mixtral) |
| Authentication | OAuth 2.0 (Google) + JWT |
| Build Tool | Maven, npm |
| Version Control | Git + GitHub |
| CI/CD | GitHub Actions |

---

## Modules

- **Module A** – Facilities & Assets Catalogue (Manuth)
- **Module B** – Booking Management (Shazra)
- **Module C** – Incident Ticket Management (Lihini)
- **Module D** – Notifications + Auth + Roles (Osanda)

---

## Innovative Features

| Member | Innovation |
|--------|------------|
| Manuth | **AI-powered facility discovery**: Natural language search/suggestions for facility bookings using Groq LLM integration. |
| Shazra | **QR-Enabled Booking Validation**: Dynamic QR code generation for approved bookings to streamline check-ins. |
| Lihini | **Smart Incident Triage**: AI-driven severity assessment and automated priority assignment for reported campus issues. |
| Osanda | **Smart Notification Intelligence**: Behavioral targeting system that learns user preferences and delivers cross-channel alerts (Web + Email). |

---

## Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.8+
- MongoDB Atlas account
- Google Cloud Console OAuth credentials
- Mailtrap account (for email notifications)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/OsandaMadugalle/it3030-paf-2026-smart-campus-group05.git
cd it3030-paf-2026-smart-campus-group05
```

### 2. Backend Setup

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Fill in your values in `application.properties`:

```properties
# MongoDB Atlas
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smartcampus

# JWT
app.jwt.secret=your-very-secure-secret-key-here
app.jwt.expiration=86400000

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=your-google-client-id
spring.security.oauth2.client.registration.google.client-secret=your-google-client-secret
spring.security.oauth2.client.registration.google.scope=email,profile

# Mailtrap (for notifications)
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=your-mailtrap-username
spring.mail.password=your-mailtrap-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Frontend URL
app.frontend.url=http://localhost:3000
app.cors.allowed-origins=http://localhost:3000
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs on: `http://localhost:8081`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

### 4. Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web Application)
4. Add Authorized redirect URI:
```
http://localhost:8081/login/oauth2/code/google
```
5. Copy Client ID and Secret to `application.properties`
6. Add test user emails in OAuth consent screen → Testing → Test Users

---

## 🔒 Security & Role Management

The system implements fine-grained Role-Based Access Control (RBAC) via **Spring Security** and **JWT**.

| Role | Access Level | Responsibilities |
|------|--------------|------------------|
| **ROLE_USER** | Basic | Submit facility bookings, report incidents, receive notification alerts. |
| **ROLE_MODERATOR** | Elevated | Review bookings, assign technicians to tickets, broadcast campus-wide alerts. |
| **ROLE_ADMIN** | Full | System configuration, user role escalation, global audit logs. |

### **Promoting to Admin:**
By default, all new users receive `ROLE_USER`. To promote a user to `ADMIN` or `MODERATOR`:
1. Login once via Google to create the user profile.
2. Update the `roles` array in the MongoDB `users` collection manually (e.g., using MongoDB Compass or Atlas).
3. Logout and login again for the new token to take effect.


---

## Branch Strategy

```
main
└── develop
    ├── feature/manuth-facilities
    ├── feature/shazra-booking-management
    ├── feature/lihini-incident-management
    ├── feature/osanda-oauth-setup
    ├── feature/osanda-jwt-roles
    ├── feature/osanda-notifications
    ├── feature/osanda-ui
    ├── feature/osanda-extra-ui
    └── fix/osanda-bug-fixes
```

---

## API Base URLs

| Service | URL |
|---------|-----|
| Backend API | http://localhost:8081/api |
| Frontend | http://localhost:3000 |
| OAuth Login | http://localhost:8081/oauth2/authorization/google |

---

## Key API Endpoints

### Auth & Roles (Osanda)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/user/me | Get current user | All |
| GET | /api/user/roles/me | Get my roles | All |
| POST | /api/admin/roles/assign | Assign role | ADMIN |
| POST | /api/admin/roles/remove | Remove role | ADMIN |
| GET | /api/admin/users | Get all users | ADMIN |
| DELETE | /api/admin/users/{id} | Delete user | ADMIN |

### Facilities (Manuth)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/facilities | Get all facilities | All |
| GET | /api/facilities/{id} | Get facility | All |
| POST | /api/facilities | Create facility | ADMIN |
| PUT | /api/facilities/{id} | Update facility | ADMIN |
| DELETE | /api/facilities/{id} | Delete facility | ADMIN |

### Bookings (Shazra)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/bookings/my | Get my bookings | USER |
| GET | /api/bookings | Get all (filtered) | ADMIN, MOD |
| POST | /api/bookings | Create booking | USER |
| PUT | /api/bookings/{id}/approve | Approve booking | ADMIN, MOD |
| PUT | /api/bookings/{id}/reject | Reject booking | ADMIN, MOD |
| PUT | /api/bookings/{id}/cancel | Cancel booking | OWNER |

### Incident Management (Lihini)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | /api/tickets | Report issue (with attachments) | USER |
| GET | /api/tickets | View my/all tickets | Any / (ADMIN, MOD) |
| GET | /api/tickets/{id} | Get detail | Any |
| PATCH | /api/tickets/{id}/assign | Claim ticket | ADMIN, MOD |
| PATCH | /api/tickets/{id}/resolve | Close ticket | ADMIN, MOD |

### Notifications (Osanda)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/notifications | Get my notifications | All |
| PATCH | /api/notifications/{id}/read | Mark as read | OWNER |
| POST | /api/notifications/broadcast | Send system-wide alert | ADMIN |
| GET | /api/notifications/preferences | Get my delivery settings | All |
| PUT | /api/notifications/preferences | Save my delivery settings | All |
| GET | /api/notifications/analytics | Get usage report | ADMIN |

### AI Services (Platform)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | /api/ai/suggest | Facility recommendations (Groq) | USER |
| POST | /api/ai/triage | Incident severity analysis | USER |

---

## Default Roles

| Role | Access |
|------|--------|
| ROLE_USER | Submit bookings, create tickets, view notifications |
| ROLE_MODERATOR | Manage bookings, assign technicians, send notifications |
| ROLE_ADMIN | Full access to all modules |

> First Google login gets ROLE_USER by default. Admin can upgrade roles from Admin Dashboard.

---

## Testing with Postman

1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm start`
3. Login with Google at `http://localhost:3000/login`
4. Copy JWT token from URL after OAuth callback
5. In Postman → Authorization → Bearer Token → paste token
6. Test endpoints listed above

---

## GitHub Actions CI/CD

Workflow triggers on push to `main` and `develop`:
- Build backend with Maven
- Run unit tests
- Build frontend with npm

Workflow: `.github/workflows/ci.yml`

---

## Project Structure

```
it3030-paf-2026-smart-campus-group05/
├── backend/
│   └── src/main/java/com/app/
│       ├── config/          # Security, CORS config
│       ├── controller/      # REST controllers
│       ├── dto/             # Request/Response DTOs
│       ├── exception/       # Custom exceptions
│       ├── model/           # MongoDB documents
│       ├── repository/      # MongoDB repositories
│       ├── security/        # JWT, OAuth handlers
│       └── service/         # Business logic
├── frontend/
│   └── src/
│       ├── components/      # Reusable components
│       ├── context/         # Auth context
│       ├── hooks/           # Custom hooks
│       ├── pages/           # Page components
│       └── services/        # API service layer
├── .github/workflows/       # CI/CD
├── .gitignore
└── README.md
```



