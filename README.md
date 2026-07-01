# Secure Task Management REST API with Role-Based Access

A scalable, secure REST API for managing tasks with **JWT authentication** and
**role-based access control (RBAC)**, plus a simple React + Tailwind frontend to
test it. Built with the MERN stack.

---

## 📌 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Environment Variables](#environment-variables)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup](#frontend-setup)
8. [API Routes](#api-routes)
9. [How to Test (Swagger + Postman)](#how-to-test)
10. [How to Create an Admin User](#how-to-create-an-admin-user)
11. [Sample API Testing Flow](#sample-api-testing-flow)
12. [Roles Explained](#roles-explained)
13. [Scalability Note](#scalability-note)
14. [Push to GitHub](#push-to-github)

---

## Overview

This project implements a production-style REST API where users can register,
log in, and manage their own tasks. Admins get elevated access to view all
tasks, all users, and platform statistics. All routes are versioned under
`/api/v1` and documented with Swagger.

---

## Features

- **Authentication** — register, login (JWT), and `/auth/me` protected route.
- **Role-Based Access Control** — `user` and `admin` roles enforced by middleware.
- **Task CRUD** — full create/read/update/delete with ownership checks.
- **Admin APIs** — list all users and view platform statistics.
- **Security** — bcrypt password hashing, JWT auth, helmet, CORS, input
  validation & sanitization, centralized error handling, correct HTTP status
  codes, and no password ever returned in responses.
- **API Versioning** — everything under `/api/v1`.
- **API Documentation** — interactive Swagger UI at `/api-docs`.
- **Postman Collection** — ready-to-import collection for manual testing.

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt.js,
express-validator, dotenv, cors, helmet, morgan, swagger-ui-express, swagger-jsdoc

**Frontend:** React.js (Vite), Tailwind CSS, Axios, React Router DOM

**Database:** MongoDB (local or MongoDB Atlas)

---

## Folder Structure

```
Project/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/      (authController, taskController, adminController)
│   │   ├── middleware/       (auth, role, error, validate)
│   │   ├── models/           (User, Task)
│   │   ├── routes/           (auth, task, admin)
│   │   ├── utils/            (generateToken, ApiError, asyncHandler)
│   │   ├── docs/swagger.js
│   │   ├── app.js
│   │   └── server.js
│   ├── postman_collection.json
│   ├── .env.example
│   ├── package.json
│   └── README.md
└── frontend/
    ├── src/
    │   ├── api/axiosInstance.js
    │   ├── components/        (Navbar, ProtectedRoute, TaskForm, TaskList)
    │   ├── pages/            (Register, Login, Dashboard, AdminDashboard)
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── README.md
```

---

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env` :

```env
VITE_API_URL=http://localhost:5000/api/v1
```

> **MongoDB URI examples**
> - Local: `mongodb://127.0.0.1:27017/task_management`
> - Atlas: `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/task_management`

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env     # then fill in real values
npm run dev              # starts with nodemon (auto-reload)
# or: npm start          # plain node
```

Server: **http://localhost:5000**
Swagger docs: **http://localhost:5000/api-docs**

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App: **http://localhost:5173**

> Start the backend **before** the frontend.

---

## API Routes

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint          | Access        | Description                          |
| ------ | ----------------- | ------------- | ------------------------------------ |
| POST   | `/auth/register`  | Public        | Register a new user                  |
| POST   | `/auth/login`     | Public        | Login, sets JWT cookie + returns user |
| POST   | `/auth/logout`    | Private       | Clear the auth cookie                |
| GET    | `/auth/me`        | Private       | Get current logged-in user           |
| GET    | `/tasks`          | Private       | Get tasks (own for user, all for admin) |
| POST   | `/tasks`          | Private       | Create a task                        |
| GET    | `/tasks/:id`      | Private/Owner | Get a single task                    |
| PUT    | `/tasks/:id`      | Private/Owner | Update a task                        |
| DELETE | `/tasks/:id`      | Private/Owner | Delete a task                        |
| GET    | `/admin/users`    | Admin         | Get all users (no passwords)         |
| GET    | `/admin/stats`    | Admin         | Get user/task statistics             |

### Authentication model

- On **register/login**, the server sets the JWT in an **httpOnly cookie** and
  also returns the token in the JSON body.
- The **React frontend** relies on the httpOnly cookie automatically (Axios is
  configured with `withCredentials: true`) — the token is never exposed to
  JavaScript, which mitigates XSS token theft.
- **Swagger and Postman** can authenticate either way: the cookie is set
  automatically after login, or you can send `Authorization: Bearer <token>`
  using the token from the login response. The auth middleware checks the
  cookie first, then the header.

---

## How to Test

### Option A — Swagger UI

1. Start the backend.
2. Open **http://localhost:5000/api-docs**.
3. Call `POST /auth/register` or `POST /auth/login` and copy the `token` from
   the response.
4. Click the green **Authorize** button (top right), paste the token, and
   confirm. Swagger now sends `Bearer <token>` on protected routes.
5. Try the task and admin endpoints directly from the browser.

### Option B — Postman

1. Import `backend/postman_collection.json` into Postman.
2. The collection has a `baseUrl` variable set to
   `http://localhost:5000/api/v1`.
3. Run **Register** or **Login** — a test script automatically saves the
   returned token into the `{{token}}` collection variable, so every other
   request is authenticated with no manual copy/paste.
4. Run **Create Task** (saves `{{taskId}}`), then the other task/admin requests.

---

## How to Create an Admin User

Any of these work:

1. **Register with role (easiest for the assignment):**
   Send `role: "admin"` in the register request body, or pick **Admin** in the
   frontend register dropdown.

   ```json
   POST /api/v1/auth/register
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "admin123",
     "role": "admin"
   }
   ```

2. **Promote an existing user via the MongoDB shell:**
   ```js
   use task_management
   db.users.updateOne({ email: "john@example.com" }, { $set: { role: "admin" } })
   ```

> In a real production system you would **not** allow self-registration as
> admin — you would seed the first admin and promote others through a protected
> admin endpoint. Self-registration is enabled here only to make the assignment
> easy to test.

---

## Sample API Testing Flow

```text
1. POST /api/v1/auth/register   → create a user, receive token
2. POST /api/v1/auth/login      → login, receive token
3. GET  /api/v1/auth/me         → confirm identity (send Bearer token)
4. POST /api/v1/tasks           → create a task
5. GET  /api/v1/tasks           → list your tasks
6. PUT  /api/v1/tasks/:id       → update status to "completed"
7. DELETE /api/v1/tasks/:id     → delete the task
8. (as admin) GET /api/v1/admin/users  → list all users
9. (as admin) GET /api/v1/admin/stats  → view statistics
```

**Expected access control behavior:**
- A normal user calling `/admin/*` → `403 Forbidden`.
- A user trying to read/update/delete another user's task → `403 Forbidden`.
- Any protected route without a token → `401 Unauthorized`.

---

## Roles Explained

| Role    | Tasks                          | Users        | Stats |
| ------- | ------------------------------ | ------------ | ----- |
| `user`  | Only their own (CRUD)          | ❌           | ❌    |
| `admin` | All tasks (CRUD)               | View all     | ✅    |

- **authMiddleware (`protect`)** verifies the JWT and loads the user.
- **roleMiddleware (`authorize`)** checks the user's role for admin routes.
- **Ownership checks** in the task controller ensure users only touch their own
  tasks, while admins can access everything.

---



