const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).send({ message: "Unauthorized access" });
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.JWT_ACCESS_SECRET || "zapshift-dev-secret", (error, decoded) => {
		if (error) {
			return res.status(401).send({ message: "Unauthorized access" });
		}

		req.decoded = decoded;
		next();
	});
};

const attachUserRole = async (req, res, next) => {
	try {
		const email = req.decoded?.email;
		if (!email) {
			return res.status(401).send({ message: "Unauthorized access" });
		}

		const user = await getDB().collection("users").findOne({ email });
		req.userRole = (user?.role || "user").toLowerCase();
		next();
	} catch (error) {
		res.status(500).send({ message: "Failed to verify user role" });
	}
};

const verifyRole = (...allowedRoles) => {
	const normalized = allowedRoles.map((r) => String(r).toLowerCase());
	return (req, res, next) => {
		const role = (req.userRole || req.decoded?.role || "user").toLowerCase();
		if (!normalized.includes(role)) {
			return res.status(403).send({ message: "Forbidden access" });
		}
		next();
	};
};

module.exports = {
	verifyToken,
	attachUserRole,
	verifyRole,
};
