const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  // Secret key should match the one used to generate the token
  const secretKey = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable if available

  console.log("Verifying token:", token.substring(0, 20) + "...");

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("Token verified successfully for user:", user);
    req.user = user; // Attach user info to the request object
    next();
  });
};

module.exports = authenticateToken;
