const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Verify the token with your secret key
    req.user = decoded; // Attach the decoded user info to the request object
    next(); // Pass control to the next middleware/handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
