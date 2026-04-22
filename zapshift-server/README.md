# ZapShift Server

The ZapShift Server is a robust Node.js backend built with **Express** and **MongoDB**. It serves as the orchestration layer for the entire ZapShift logistics ecosystem, handling complex parcel lifecycles, real-time tracking updates, secure role-based access, and financial data management.

## 🔗 Live API
[https://zapshift-server-ebon.vercel.app](https://zapshift-server-ebon.vercel.app)

## ✨ Technical Features
*   **Workflow Engine**: Automated state machine for parcel transitions (Pending → In-Transit → Delivered).
*   **Granular Security**: Multi-tier authentication using Firebase verifyToken and backend-signed JWTs with role-aware middleware.
*   **Tracking Analytics**: Persistent tracking timeline storage with metadata for every operational touchpoint.
*   **Scalable Architecture**: Serverless-ready design optimized for Vercel deployment and MongoDB Atlas.

## 🛠️ Technology Stack
*   **Runtime**: Node.js
*   **Framework**: Express 5
*   **Database**: MongoDB (Native Driver)
*   **Security**: jsonwebtoken, Firebase Admin SDK
*   **Utilities**: dotenv, cors, nodemon

## 📂 Project Structure
*   `api/index.js`: Vercel serverless entry point.
*   `config/db.js`: MongoDB connection orchestration.
*   `middleware/`: Specialized auth and role validation guards.
*   `controllers/`: Core business logic for users, riders, and parcels.
*   `routes/`: API endpoint definitions with role-based protection.

## 📊 API Endpoints

### 🔐 Authentication
*   `POST /jwt`: Issue signed access tokens based on Firebase session.

### 👥 User Management
*   `POST /users/sync`: Onboard/sync Firebase users to MongoDB.
*   `GET /users/me`: Fetch detailed role-specific profile data.
*   `GET /users/riders/list`: Admin view for rider applications and reviews.
*   `POST /users/rider-request`: Submit professional rider application.

### 📦 Parcel Operations
*   `POST /parcels`: Securely book a new shipment with price validation.
*   `GET /parcels/:id`: Fetch deep parcel details including tracking history.
*   `PATCH /parcels/:id/workflow`: Transition parcel states (In-Transit, Reached Hub, etc.).
*   `GET /parcels/admin/stats`: Aggregate logistics data for admin dashboards.

## ⚙️ Environment Variables
Create a `.env` file in the `zapshift-server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_strong_secret
```

## 🚀 Local Development

1.  **Install**: `npm install`
2.  **Start Server**: `npm start`
3.  **Dev Mode**: `npm run dev` (with nodemon)

## 🏗️ Deployment Notes
*   Deployed on **Vercel Serverless Functions**.
*   Requires `vercel.json` for mapping API routes to the `api/index.js` entry point.
*   CORS is configured to allow secure handshakes with the ZapShift Client.

---
Developed by **Dipta Acharjee** | [Root README](../README.md)
