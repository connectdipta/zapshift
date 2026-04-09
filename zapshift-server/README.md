# ZapShift Server

Backend API for ZapShift, a role-based parcel delivery and tracking system. This service provides authentication token issuance, parcel lifecycle management, rider/admin workflows, tracking timeline persistence, and payment record handling.

## Table of Contents

- Project Overview
- Core Responsibilities
- Tech Stack
- Architecture Summary
- Data Collections
- Authentication and Authorization
- API Endpoints
- Environment Variables
- Getting Started
- Available Scripts
- Status Workflow
- Error Handling and Security Notes
- Deployment Notes

## Project Overview

ZapShift Server is an Express + MongoDB API that powers:

- User synchronization and role management
- JWT token generation for authenticated requests
- Parcel CRUD and role-aware access checks
- Payment processing state updates
- Tracking timeline creation and lookup
- Admin workflow actions (pickup, handoff, shipping, delivery assignment)
- Rider workflow confirmations and earnings updates

## Core Responsibilities

- Validate and authorize requests by role (`user`, `admin`, `rider`)
- Keep parcel status synchronized with tracking history
- Generate and persist unique parcel tracking numbers
- Record payment transactions and admin payment history
- Support dashboards with stats and operational data

## Tech Stack

- Node.js
- Express 5
- MongoDB Node Driver
- JSON Web Token (jsonwebtoken)
- CORS
- dotenv
- Nodemon (dev)

## Architecture Summary

- Entry point: `index.js`
- DB connection utility: `config/db.js`
- Auth middleware: `middleware/authMiddleware.js`
- Route modules:
  - `routes/userRoutes.js`
  - `routes/parcelRoutes.js`
- Controller modules:
  - `controllers/userController.js`
  - `controllers/parcelController.js`

## Data Collections

The server currently works with these MongoDB collections:

- `users`
- `riderApplications`
- `parcels`
- `tracking`
- `payments`

Database name is set to `zapshiftDB`.

## Authentication and Authorization

### Token Issuance

- `POST /jwt`
- Accepts `{ email }`
- Looks up user role from database
- Returns signed JWT and expiration timestamp

### Middleware Chain

- `verifyToken` validates Bearer token
- `attachUserRole` resolves current role from `users` collection
- `verifyRole(...roles)` enforces route-level access

## API Endpoints

Base URL example: `http://localhost:3000`

### Health

- `GET /` Server health check

### Auth

- `POST /jwt` Issue access token by email

### Users

- `POST /users/sync` Create/update user profile from auth provider
- `GET /users/me?email=` Get current user profile (token email must match)
- `GET /users` Admin: list users with optional filters
- `PATCH /users/:id/role` Admin: update role
- `GET /users/riders/list` Admin: list rider applications
- `PATCH /users/riders/:id/review` Admin: approve/reject rider
- `DELETE /users/riders/:id` Admin: delete rider application
- `POST /users/rider-request` Create/update rider application

### Parcels

- `POST /parcels` Create parcel
- `GET /parcels` List parcels with role-based filtering
- `GET /parcels/:id` Get parcel by id with access control
- `PATCH /parcels/:id/pay` Mark parcel paid, create payment and tracking info
- `PATCH /parcels/:id/status` Admin/Rider: update status
- `PATCH /parcels/:id/assign-riders` Admin: assign pickup/delivery riders
- `PATCH /parcels/:id/workflow` Admin: step-driven delivery workflow actions
- `GET /parcels/:id/tracking` Get timeline for a parcel
- `GET /parcels/track/:query` Find parcel by tracking number or parcel id
- `GET /parcels/admin/stats` Admin dashboard stats
- `GET /parcels/admin/payments` Admin payment history

## Environment Variables

Create a `.env` file in `zapshift-server`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_strong_jwt_secret
```

Notes:

- If `JWT_ACCESS_SECRET` is missing, a dev fallback is used.
- If `MONGODB_URI` is missing, server exits on startup.

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas or local MongoDB instance

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

- Add required keys in `.env`
- Ensure MongoDB user has read/write permission for `zapshiftDB`

### 4. Run in development

```bash
npm run dev
```

Server runs on `http://localhost:3000` (or `PORT` value).

## Available Scripts

- `npm run dev` Start with nodemon
- `npm start` Start with node

## Status Workflow

Core delivery statuses used across parcel and tracking flows:

1. `pending`
2. `paid`
3. `ready-to-pickup`
4. `in-transit`
5. `reached-service-center`
6. `shipped`
7. `ready-for-delivery`
8. `delivered`

Additional statuses:

- `failed`
- `damaged`

## Error Handling and Security Notes

- Most protected endpoints return:
  - `401 Unauthorized` for missing/invalid token
  - `403 Forbidden` for role/access violations
  - `400 Bad Request` for invalid ids or payloads
- JWT expiry is handled by client auto-logout flow.
- Role is derived from DB to avoid stale token role assumptions.

## Deployment Notes

- Set `NODE_ENV=production` in deployment runtime.
- Restrict CORS origin to trusted frontend domains.
- Use a strong `JWT_ACCESS_SECRET` in production.
- Add logging/monitoring (e.g., request tracing and error reporting).
- Consider rate limiting and payload validation for internet-facing deployment.

## Related Project

- Frontend client lives in `../zapshift-client`
