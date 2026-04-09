const { connectDB } = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

/* ===== start server AFTER DB ===== */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
  });
});