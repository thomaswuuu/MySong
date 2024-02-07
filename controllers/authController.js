const JWT = require("jsonwebtoken");
const { JWT_SECRET, ADMIN_EMAIL, ADMIN_NAME } = process.env;

const createAuthToken = (req, res) => {
  // Create JWT token
  const user = { name: req.user.name, email: req.user.email };
  const token = JWT.sign({ user }, JWT_SECRET, { expiresIn: "1h" });

  return res.json({ token });
};

const superAuthCheck = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (authHeader) {
    const token = authHeader.substring(7); // Get token value after "Bearer" string

    if (!token) {
      return res.status(401).json({ message: "Token doesn't exist" });
    }

    JWT.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = decoded.user;
      if (req.user.email == ADMIN_EMAIL && req.user.name == ADMIN_NAME) next();
      else res.status(401).json({ message: "Permission Denial" });
    });
  } else {
    res.status(500).json({ message: "No Authorization header" });
  }
};

const normalAuthCheck = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (authHeader) {
    const token = authHeader.substring(7); // Get token value after "Bearer" string

    if (!token) {
      return res.status(401).json({ message: "Token doesn't exist" });
    }

    JWT.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = decoded.user;
      next();
    });
  } else {
    res.status(500).json({ message: "No Authorization header" });
  }
};

module.exports = { createAuthToken, superAuthCheck, normalAuthCheck };
