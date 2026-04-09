const express = require("express");
const router = express.Router();
const { verifyToken, attachUserRole, verifyRole } = require("../middleware/authMiddleware");
const {
  createParcel,
  getParcels,
  getParcelById,
  payParcel,
  getAdminStats,
  getPaymentHistory,
  updateParcelStatus,
  assignParcelRiders,
  getParcelTracking,
  searchTracking,
  processWorkflowAction,
} = require("../controllers/parcelController");

router.use(verifyToken);
router.use(attachUserRole);

// send parcel
router.post("/", createParcel);

// get parcels
router.get("/", getParcels);

// admin stats
router.get("/admin/stats", verifyRole("admin"), getAdminStats);

// admin payment history
router.get("/admin/payments", verifyRole("admin"), getPaymentHistory);

// tracking search by parcel id or tracking number
router.get("/track/:query", searchTracking);

// tracking timeline for a parcel
router.get("/:id/tracking", getParcelTracking);

// get parcel by id
router.get("/:id", getParcelById);

// pay parcel
router.patch("/:id/pay", payParcel);

// admin status update
router.patch("/:id/status", verifyRole("admin", "rider"), updateParcelStatus);

// admin rider assignment
router.patch("/:id/assign-riders", verifyRole("admin"), assignParcelRiders);

// admin delivery workflow engine
router.patch("/:id/workflow", verifyRole("admin"), processWorkflowAction);

module.exports = router;