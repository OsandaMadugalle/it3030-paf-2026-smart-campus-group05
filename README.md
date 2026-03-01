# Smart Campus Project

This is a full-stack web application for a Smart Campus.

## Tech Stack
- **Backend**: Spring Boot 3.2, Java 17, Maven
- **Frontend**: React 18, Axios, React Router
- **Database**: MongoDB
- **Security**: Spring Security, JWT, OAuth2 (Google)

## Project Structure
- `backend/`: Spring Boot application
- `frontend/`: React application

## Getting Started

### Prerequisites
- JDK 17 or higher
- Node.js (v18+) & npm
- MongoDB (Local or Atlas)

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd it3030-paf-2026-smart-campus-group05
```

#### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create your local configuration file from the template:
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```
3. Open `src/main/resources/application.properties` and update the following:
   - `spring.data.mongodb.uri`: Your MongoDB connection string.
   - `app.jwt.secret`: A secure random string for JWT signing.
   - `spring.security.oauth2.client.registration.google.*`: Your Google Cloud Console credentials.
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   *The server will start on http://localhost:8081*

#### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   *The app will be available at http://localhost:3000*

## Authentication
The project uses JWT and Google OAuth2 for authentication. Ensure your Google OAuth2 redirect URI is set to `http://localhost:8081/login/oauth2/code/google` in the Google Cloud Console.
