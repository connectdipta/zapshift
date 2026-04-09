const app = require("../app");
const { connectDB } = require("../config/db");

let connectionPromise;

module.exports = async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }

  await connectionPromise;
  return app(req, res);
};
