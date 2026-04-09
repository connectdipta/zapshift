# ZapShift

Role-based parcel delivery platform with real-time tracking, workflow-driven operations, and nationwide coverage support.

## Live Deployments

- Frontend: https://zapshift-partner.vercel.app
- Backend API: https://zapshift-server-ebon.vercel.app

## Repository Structure

- [zapshift-client](zapshift-client) React + Vite frontend app
- [zapshift-server](zapshift-server) Express + MongoDB backend API

## Documentation

- Frontend docs: [zapshift-client/README.md](zapshift-client/README.md)
- Backend docs: [zapshift-server/README.md](zapshift-server/README.md)

## Product Summary

ZapShift supports three primary roles:

- User: create parcels, pay charges, track delivery, view history
- Admin: manage users, riders, shipping operations, and payment visibility
- Rider: handle pickups/deliveries with tracking confirmation and earnings updates

## Key Features

- End-to-end parcel lifecycle from booking to delivery
- Tracking timeline with status updates and actor metadata
- Payment success flow with unique 6-digit tracking number
- Admin delivery workflow actions by step and status
- Rider confirmation flow with secure tracking validation
- Public pages and role-based dashboard routing
- Google/Firebase authentication with backend JWT integration

## Workflow Statuses

1. pending
2. paid
3. ready-to-pickup
4. in-transit
5. reached-service-center
6. shipped
7. ready-for-delivery
8. delivered

Additional operational statuses:

- failed
- damaged

## Pricing Reference

| Parcel Type | Weight | Within City | Outside City/District |
| --- | --- | --- | --- |
| Document | Any | 60 BDT | 80 BDT |
| Non-Document | Up to 3kg | 110 BDT | 150 BDT |
| Non-Document | Over 3kg | +40 BDT/kg | +40 BDT/kg + 40 BDT extra |

## Quick Start

1. Clone repository.
2. Configure environment files for client and server.
3. Start backend API.
4. Start frontend app.

See setup instructions in:

- [zapshift-client/README.md](zapshift-client/README.md)
- [zapshift-server/README.md](zapshift-server/README.md)

## Deployment

- Frontend is deployed on Vercel.
- Backend is deployed on Vercel Serverless functions.
- Ensure frontend environment points to the deployed backend URL.

## Recent Production Notes

- Leaflet marker rendering was fixed for Vite production builds.
- Firebase env values are trimmed in runtime to avoid hidden newline issues.
- Login redirect flow now waits for backend JWT to reduce dashboard loading loops.

