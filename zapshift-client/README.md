# ZapShift Client

Frontend single-page application for ZapShift. Built with React and Vite, this app delivers public pages, authentication, and role-based dashboards for user, admin, and rider operations.

## Live URL

- https://zapshift-partner.vercel.app

## Stack

- React 18
- Vite 7
- React Router 7
- TanStack Query 5
- Axios
- Firebase Auth
- Tailwind CSS 4
- DaisyUI 5
- Framer Motion
- AOS
- Recharts
- SweetAlert2
- Leaflet + React Leaflet

## Features

### Public Site

- Home, Pricing, About, Coverage, Send Parcel, Be a Rider
- Responsive navigation with mobile optimization
- Animated page transitions and scroll reveals

### Authentication

- Email and password login
- Google sign-in
- Backend JWT token handshake after Firebase auth
- Auto-logout based on token expiry

### Dashboard

- User dashboard: parcels, pay, track, invoices, settings
- Admin dashboard: users, riders, delivery management, payments
- Rider dashboard: pickups, deliveries, history, earnings

## Route Access Model

- Public pages are accessible directly from navbar.
- Send Parcel and Rider forms enforce login when submitting.
- Dashboard routes are protected and role-aware.

## Environment Variables

Create .env in zapshift-client:

```env
VITE_API_URL=http://localhost:3000
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_imgHost=your_image_host_url
```

## Important Auth Notes

- Make sure your frontend domain is listed in Firebase authorized domains.
- Runtime config trims whitespace/newlines from Firebase env values to avoid malformed iframe URLs.
- Login navigation waits for backend token readiness to reduce dashboard loading loops.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Preview production bundle:

```bash
npm run preview
```

## Scripts

- npm run dev
- npm run build
- npm run preview
- npm run lint

## Deployment

- Hosted on Vercel.
- Production env vars are configured in Vercel project settings.
- Frontend points to backend API URL:
  - https://zapshift-server-ebon.vercel.app

## Troubleshooting

### Google sign-in popup opens but app hangs on loading

- Confirm backend /jwt endpoint is reachable.
- Confirm VITE_API_URL is set to deployed backend.
- Confirm Firebase authorized domain includes your Vercel domain.

### Map markers not visible in Coverage page

- Leaflet icon path fix is already integrated for Vite production builds.
- If markers fail after cache update, hard refresh once.

### Repeated redirects to login

- Check token keys in browser local storage:
  - zapshift_access_token
  - zapshift_access_expires_at
- Verify server JWT secret and CORS configuration.

## Related Docs

- Root docs: [README.md](../README.md)
- Server docs: [zapshift-server/README.md](../zapshift-server/README.md)
