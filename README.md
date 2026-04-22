# ZapShift Logistics Platform

ZapShift is an enterprise-grade, role-based parcel delivery platform designed for high-efficiency logistics. It features real-time tracking, workflow-driven operations, and a nationwide coverage network with a premium user experience.

## 🔗 Live Deployments

*   **Frontend Application**: [https://zapshift-partner.vercel.app](https://zapshift-partner.vercel.app)
*   **Backend API**: [https://zapshift-server-ebon.vercel.app](https://zapshift-server-ebon.vercel.app)

## 🚀 Recent Professionalization (April 2026)

The platform recently underwent a major UI/UX overhaul to reach enterprise standards:
*   **Premium Public Pages**: Redesigned "About Us", "Pricing", and "Rider Onboarding" with high-contrast design tokens, interactive motion components, and unified container structures.
*   **Enhanced Functional Stability**: Fixed parcel submission flows, session-aware navigation, and dashboard map scaling.
*   **Brand Integrity**: Removed all placeholder content ("Posture Pro", "Lorem Ipsum") and unified typography and color palettes using the "Midnight/Lime" aesthetic.
*   **Icon Stability**: Resolved Material Design icon import issues for stable production bundling.

## 📂 Repository Structure

*   [zapshift-client](zapshift-client): React + Vite frontend application with Framer Motion animations.
*   [zapshift-server](zapshift-server): Node.js + Express + MongoDB backend API with JWT security.

## 👥 Role-Based Architecture

ZapShift supports three distinct user experiences:
*   **User Dashboard**: Create parcels, instant price estimation, live tracking, and digital invoices.
*   **Admin Console**: Comprehensive management of users, riders, shipping operations, and payment reconciliation.
*   **Rider Interface**: specialized interface for pickup/delivery tasks, earning tracking, and secure OTP-based delivery confirmation.

## ✨ Key Features

*   **End-to-End Parcel Lifecycle**: Complete workflow from booking and automated pricing to final delivery.
*   **Interactive Coverage Map**: Searchable nationwide coverage grid with synchronized hub locations.
*   **Smart Pricing Engine**: Dynamic price calculation based on weight, parcel type, and regional transit taxes.
*   **Secure Authentication**: Firebase/Google Auth integration with hardened backend JWT validation.
*   **Real-Time Tracking**: Unique 6-digit tracking IDs with full status history and actor metadata.

## 📊 Logistics Workflow

1.  **Pending**: Initial booking received.
2.  **Paid**: Payment confirmed (Automatic or Manual).
3.  **Ready-to-Pickup**: Assigned to regional hub.
4.  **In-Transit**: Parcel is moving between nodes.
5.  **Reached-Service-Center**: Arrived at destination hub.
6.  **Shipped/Out-for-Delivery**: Last-mile rider assigned.
7.  **Delivered**: Success confirmation via OTP/Digital Signature.

## 🛠️ Tech Stack

*   **Frontend**: React, Tailwind CSS, Framer Motion, Leaflet Maps, Swiper.js, Lottie Animations.
*   **Backend**: Node.js, Express, MongoDB, Firebase Admin, JWT.
*   **Infrastructure**: Vercel (Frontend & Serverless), MongoDB Atlas.

## 🏁 Quick Start

1.  Clone the repository.
2.  Configure `.env` files in both `/zapshift-client` and `/zapshift-server`.
3.  Install dependencies: `npm install` in both directories.
4.  Run Backend: `cd zapshift-server && npm start`.
5.  Run Frontend: `cd zapshift-client && npm run dev`.

---
© 2025 ZapShift — Designed & Developed by **Dipta Acharjee**
