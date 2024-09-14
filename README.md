## Here’s a complete README.md file with the Postman documentation, setup instructions, and details about the API endpoints

# NestJS Authentication and Role-Based Access Control (RBAC) System

This project implements an authentication and role-based access control (RBAC) system using NestJS, MongoDB, and Redis. The system manages user authentication via JWT, supports session management using Redis, and implements role-based access for Admin, Student, and CRM roles.

## Project Setup

### 1. Clone the Repository

Clone the project from GitHub to your local machine:

```bash
git clone https://git@github.com:zumerhub/auth-rbac-system.git
cd auth-rbac-system


2. Install Dependencies
Install the required npm packages:

npm install

3. Set Up Environment Variables
Create a .env file in the root directory with the following environment variables:

env
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_TOKEN_EXPIRATION=token_expiration_time

The server will run at http://localhost:8080.

5. Running Unit Tests
To run unit tests for key features, use:
npm run test


API Documentation
You can use the provided Postman collection to test the API.

Postman Collection
A Postman collection file is included in this repository under the postman/ folder. You can import it into Postman to test all the API endpoints.

Endpoints
1. Sign Up
Endpoint: POST /auth/signup
Description: Register a new user.
Headers:
Content-Type: application/json
Body:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}

Responses:
201 Created: { "token": "jwt_token" }
400 Bad Request: Invalid input

2. Login
Endpoint: POST /auth/login
Description: Authenticate a user and obtain a JWT token.
Headers:
Content-Type: application/json
Body:
{
  "email": "string",
  "password": "string"
}
Responses:
200 OK: { "token": "jwt_token" }
401 Unauthorized: Invalid credentials


3. Logout
Endpoint: POST /auth/logout
Description: Logout the user by invalidating the token.
Headers:
Authorization: Bearer jwt_token
Responses:
200 OK: Successfully logged out
401 Unauthorized: Invalid token


4. Profile
Endpoint: GET /auth/profile
Description: Get the profile information of the logged-in user.
Headers:
Authorization: Bearer jwt_token
Responses:
200 OK: { "id": "user_id", "name": "user_name", "email": "user_email", "role": "user_role" }
401 Unauthorized: Invalid token

5. Protected Admin Route
Endpoint: GET /admin/dashboard
Description: Access to admin-only resources.
Headers:
Authorization: Bearer jwt_token
Responses:
200 OK: Successful access for admins
403 Forbidden: User not authorized
Role-Based Access Control (RBAC)
This project demonstrates role-based access control by restricting certain routes to users with specific roles: Admin, Student, and CRM. Access is controlled via the RolesGuard and custom decorators applied to the routes.

Required Roles:
Admin: Full access to all resources.
Student: Access to limited resources.
CRM: Access to customer-related resources.
Session Management with Redis
This project integrates Redis for session management and token validation. The Redis instance stores the JWT token's expiration time and validates session tokens across requests.



Conclusion
This project implements a secure and scalable authentication system with role-based access control. The use of JWT, Redis, and MongoDB ensures secure authentication, efficient session management, and user role handling.
