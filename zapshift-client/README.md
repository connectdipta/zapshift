# ZapShift Client

Frontend application for ZapShift, a role-based parcel delivery platform for Bangladesh. This client handles public pages, authentication, and dashboards for User, Admin, and Rider workflows.

## Table of Contents

- Project Overview
- Core Features
- Tech Stack
- Architecture Summary
- Route Map
- Environment Variables
- Getting Started
- Available Scripts
- Build and Deployment
- Integration Notes
- Troubleshooting

## Project Overview

ZapShift Client is a React + Vite single-page application that enables:

- Parcel booking with dynamic pricing inputs
- Secure login/registration with Firebase Auth
- JWT-based session handling for protected API requests
- Role-based dashboards (user, admin, rider)
- Tracking timeline and delivery workflow visibility
- Payment flow with tracking number confirmation

## Core Features

### Public Experience

- Landing pages: Home, About Us, Pricing
- Coverage page with service center data
- Rider application entry points
- Auth pages (email/password and Google)

### User Dashboard

- Dashboard overview and parcel stats
- Create and manage parcels
- Pay parcel charges
- Track parcel status and timeline
- View invoices/payment history
- Update profile/settings

### Admin Dashboard

- Operational overview and analytics
- User management and role updates
- Rider request review and management
- Delivery management and workflow actions
- Payment history visibility

### Rider Dashboard

- Rider overview and earnings visibility
- Pickup and delivery task lists
- Status confirmation flows
- Delivery history

## Tech Stack

- React 18
- Vite 7
- React Router 7
- TanStack React Query 5
- Axios
- Firebase Authentication
- Tailwind CSS 4 + DaisyUI 5
- SweetAlert2
- Recharts
- Lucide React / React Icons

## Architecture Summary

- Auth state is managed by Auth Provider and Firebase observer.
- Backend JWT token is requested after login and persisted in localStorage.
- Axios secure instance adds Bearer token to every API call.
- 401 responses clear token and redirect user to login.
- Dashboard route access is protected via Private, Admin, and Rider route guards.

## Route Map

### Public Routes

- `/` Home
- `/pricing`
- `/about-us`
- `/coverage` (protected)
- `/rider` (protected)
- `/send-parcel` (protected)
- `/pay/:id` (protected)

### Auth Routes

- `/login`
- `/register`
- `/signin` -> redirects to `/login`
- `/signup` -> redirects to `/register`

### Dashboard Routes

- `/dashboard/admin` and related admin modules
- `/dashboard/user` and related user modules
- `/dashboard/rider` and related rider modules
- Shared utilities: parcel details, track, pay, invoices, settings

## Environment Variables

Create a `.env` file in `zapshift-client`:

```env
VITE_API_URL=http://localhost:3000
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm 9+
- Running ZapShift server API
- Firebase project with Authentication enabled

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

- Add all required `VITE_` keys in `.env`
- Set `VITE_API_URL` to your server URL

### 4. Start development server

```bash
npm run dev
```

Client runs at `http://localhost:5173` by default.

## Available Scripts

- `npm run dev` Start Vite development server
- `npm run build` Build production bundle
- `npm run preview` Preview built output locally
- `npm run lint` Run ESLint checks

## Build and Deployment

### Production Build

```bash
npm run build
```

Artifacts are generated in the `dist/` directory.

### Preview Build Locally

```bash
npm run preview
```

## Integration Notes

- This client expects the server to expose `/jwt`, `/users/*`, and `/parcels/*` endpoints.
- Tokens are stored in:
  - `zapshift_access_token`
  - `zapshift_access_expires_at`
- Auto logout is scheduled based on backend token expiry.

## Troubleshooting

### App redirects to login repeatedly

- Check `VITE_API_URL` correctness.
- Confirm backend is running and `/jwt` works.
- Verify `JWT_ACCESS_SECRET` is set server-side.

### Firebase login succeeds but dashboard fails

- Ensure `/users/sync` endpoint is reachable.
- Confirm CORS and API base URL.

### Build issues

- Remove `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Related Project

- Server API lives in `../zapshift-server`
