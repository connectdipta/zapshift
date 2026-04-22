# ZapShift Client

The ZapShift Client is a high-performance, single-page application (SPA) built with **React** and **Vite**. It provides a premium user interface for customers, administrators, and riders to manage logistics operations with real-time feedback and high-fidelity animations.

## 🔗 Live Application
[https://zapshift-partner.vercel.app](https://zapshift-partner.vercel.app)

## ✨ Premium UI/UX Overhaul (April 2026)
The frontend has been professionalized with enterprise-grade design standards:
*   **Aesthetic Tokens**: Unified "Midnight Teal" (#103d45) and "Lime Glow" (#caeb66) color palette across all modules.
*   **Interactive Components**: Custom motion-based tabs in "About Us", real-time cost estimator in "Pricing", and high-contrast onboarding for "Riders".
*   **Standardized Layout**: Unified container widths (`max-w-7xl`) and rounding (`rounded-[3.5rem]`) for a cohesive "card-based" interface.
*   **Performance Map**: Interactive Leaflet integration with search-to-map synchronization and custom pulse-effect pins.

## 🛠️ Technology Stack
*   **Core**: React 18, Vite 7, React Router 7.
*   **Styling**: Tailwind CSS 4, DaisyUI 5, Vanilla CSS for custom tokens.
*   **Animation**: Framer Motion, Lottie-web, Swiper.js (for review carousels).
*   **Data Management**: TanStack Query 5 (React Query), Axios (with secure interceptors).
*   **Maps & Charts**: React Leaflet, Recharts.
*   **Auth**: Firebase SDK with backend JWT integration.

## 📂 Features & Modules

### 🌐 Public Experience
*   **Dynamic Landing**: Hero banners with Lottie animations and responsive section transitions.
*   **Advanced Coverage**: Real-time searchable map of nationwide service hubs.
*   **Smart Pricing**: Instant shipment cost calculation based on parcel attributes.

### 🔐 Secure Dashboards
*   **User Hub**: Parcel booking, tracking timeline, payment success workflows, and invoice history.
*   **Admin Console**: Multi-dimensional management of users, riders, shipping batches, and financial reconciliation.
*   **Rider Portal**: Task-specific view for pickups and deliveries with earning history and GPS-aware coverage.

## ⚙️ Environment Variables
Create a `.env` file in the `zapshift-client` directory:
```env
VITE_API_URL=https://zapshift-server-ebon.vercel.app
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
```

## 🚀 Local Development

1.  **Install**: `npm install`
2.  **Dev Server**: `npm run dev`
3.  **Build**: `npm run build`
4.  **Preview**: `npm run preview`

## 🏗️ Deployment Notes
*   Hosted on **Vercel** with automated CI/CD.
*   Production environment variables are securely managed in Vercel project settings.
*   The application includes a specialized `vercel.json` for SPA routing support.

---
Developed by **Dipta Acharjee** | [Root README](../README.md)
