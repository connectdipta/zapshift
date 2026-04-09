require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { getDB } = require("./config/db");
const parcelRoutes = require("./routes/parcelRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZapShift Server is Running");
});

app.post("/jwt", async (req, res) => {
  const user = req.body;
  if (!user?.email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const dbUser = await getDB().collection("users").findOne({ email: user.email });
  const role = (dbUser?.role || "user").toLowerCase();

  const expiresInSeconds = 3 * 60 * 60;
  const token = jwt.sign(
    { email: user.email, role },
    process.env.JWT_ACCESS_SECRET || "zapshift-dev-secret",
    { expiresIn: expiresInSeconds }
  );

  res.send({
    token,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
  });
});

app.use("/parcels", parcelRoutes);
app.use("/users", userRoutes);

module.exports = app;
