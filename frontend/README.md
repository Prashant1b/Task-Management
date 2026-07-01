# Task Management — Frontend

A simple React + Tailwind CSS UI to test the Secure Task Management REST API.

## Tech Stack

- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # then edit VITE_API_URL if needed
npm run dev
```

App runs at **http://localhost:5173**.

## Environment Variables

| Variable       | Description                | Default                          |
| -------------- | -------------------------- | -------------------------------- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api/v1`   |

> Make sure the backend is running first, and that the backend's `CLIENT_URL`
> matches this app's URL (`http://localhost:5173`) for CORS.

## Pages

| Route        | Access      | Description                          |
| ------------ | ----------- | ------------------------------------ |
| `/register`  | Public      | Create an account (user or admin)    |
| `/login`     | Public      | Log in and store the JWT             |
| `/dashboard` | Protected   | Create / view / edit / delete tasks  |
| `/admin`     | Admin only  | Platform stats + all users           |

## Notes

- The JWT is stored in an **httpOnly cookie** set by the backend, so it is not
  readable by JavaScript (reduces XSS token theft). Only a non-sensitive `user`
  object is cached in `localStorage` for rendering the UI.
- Axios is configured with `withCredentials: true`, so the auth cookie is sent
  automatically on every request — no manual token handling needed.
- Requires the backend `CLIENT_URL` to match this app's origin for the cookie
  and CORS `credentials` to work.
