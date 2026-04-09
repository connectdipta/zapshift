const express = require("express");
const router = express.Router();
const { verifyToken, attachUserRole, verifyRole } = require("../middleware/authMiddleware");
const {
  upsertUser,
  getCurrentUser,
  getUsers,
  updateUserRole,
  getRiders,
  reviewRider,
  deleteRider,
  requestRider,
} = require("../controllers/userController");

router.post("/sync", upsertUser);
router.use(verifyToken);
router.use(attachUserRole);
router.get("/me", getCurrentUser);
router.get("/", verifyRole("admin"), getUsers);
router.patch("/:id/role", verifyRole("admin"), updateUserRole);
router.get("/riders/list", verifyRole("admin"), getRiders);
router.patch("/riders/:id/review", verifyRole("admin"), reviewRider);
router.delete("/riders/:id", verifyRole("admin"), deleteRider);
router.post("/rider-request", requestRider);

module.exports = router;
