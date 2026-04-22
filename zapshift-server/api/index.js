const app = require("../app");
const { connectDB } = require("../config/db");

let connectionPromise;

module.exports = async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDB().catch((err) => {
      // Reset so the next request retries instead of being permanently broken
      connectionPromise = null;
      throw err;
    });
  }

  await connectionPromise;
  return app(req, res);
};
