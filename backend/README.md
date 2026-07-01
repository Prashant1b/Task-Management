# Secure Task Management API — Backend

REST API with JWT authentication (httpOnly cookie), role-based access control,
task CRUD, and admin statistics. All routes are versioned under `/api/v1`.

Full documentation, testing flow, and GitHub steps are in the
[root README](../README.md).

## Quick Start

```bash
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm run dev
```

- API: `http://localhost:5000`
- Swagger docs: `http://localhost:5000/api-docs`

## Scripts

| Script          | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start with nodemon (auto-reload)  |
| `npm start`     | Start with plain node             |

## Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Testing

- **Swagger:** open `/api-docs`, log in, click **Authorize**, paste the token.
- **Postman:** import `postman_collection.json`; login auto-saves the token.
