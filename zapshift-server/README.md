# ZapShift Server

Backend API for ZapShift. Provides authentication token issuance, parcel lifecycle management, delivery workflow orchestration, tracking timeline persistence, rider operations, and payment records.

## Live URL

- https://zapshift-server-ebon.vercel.app

## Stack

- Node.js
- Express 5
- MongoDB Node Driver
- jsonwebtoken
- dotenv
- cors
- nodemon

## Architecture

- Express app module: app.js
- Local runtime entry: index.js
- Vercel serverless entry: api/index.js
- DB config: config/db.js
- Auth middleware: middleware/authMiddleware.js
- Routes:
  - routes/userRoutes.js
  - routes/parcelRoutes.js
- Controllers:
  - controllers/userController.js
  - controllers/parcelController.js

## Data Collections

- users
- riderApplications
- parcels
- tracking
- payments

Database name: zapshiftDB

## Auth Flow

1. Client authenticates with Firebase.
2. Client calls POST /jwt with email.
3. Server signs JWT with role and returns token + expiry.
4. Protected routes validate bearer token and user role.

## Access Control

- verifyToken: validates bearer token
- attachUserRole: resolves current role from database
- verifyRole: guards role-specific endpoints

## API Endpoints

### Health

- GET /

### Token

- POST /jwt

### Users

- POST /users/sync
- GET /users/me?email=
- GET /users
- PATCH /users/:id/role
- GET /users/riders/list
- PATCH /users/riders/:id/review
- DELETE /users/riders/:id
- POST /users/rider-request

### Parcels

- POST /parcels
- GET /parcels
- GET /parcels/:id
- PATCH /parcels/:id/pay
- PATCH /parcels/:id/status
- PATCH /parcels/:id/assign-riders
- PATCH /parcels/:id/workflow
- GET /parcels/:id/tracking
- GET /parcels/track/:query
- GET /parcels/admin/stats
- GET /parcels/admin/payments

## Status Lifecycle

1. pending
2. paid
3. ready-to-pickup
4. in-transit
5. reached-service-center
6. shipped
7. ready-for-delivery
8. delivered

Additional states:

- failed
- damaged

## Environment Variables

Create .env in zapshift-server:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_strong_secret
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
npm run dev
```

## Scripts

- npm run dev
- npm start

## Deployment Notes

- Deployed on Vercel serverless.
- Routing is configured in vercel.json.
- Ensure MONGODB_URI and JWT_ACCESS_SECRET are set in Vercel environments.
- Keep CORS restricted in production if needed.

## Common Issues

### Unauthorized access on protected routes

- Missing or expired bearer token.
- Token exists but role is not allowed for endpoint.

### Client login succeeds but protected calls fail

- Check deployed frontend VITE_API_URL points here.
- Confirm /jwt endpoint returns token successfully.

## Related Docs

- Root docs: [README.md](../README.md)
- Client docs: [zapshift-client/README.md](../zapshift-client/README.md)
