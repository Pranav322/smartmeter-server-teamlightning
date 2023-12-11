const jwt = require('jsonwebtoken');
const JWT_SECRET = "WebTokenSignedBy@teamLightning";

const fetchUser = (req, res, next) => {
      const token = req.header('auth-token');

      if (!token) {
            return res.status(401).send({ error: "Please authenticate with valid token" });
      }

      try {
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data.user;
            next();
      } catch (error) {
            // Send a more detailed error message when token verification fails
            return res.status(401).send({ error: "Invalid token or unauthorized access" });
      }
}

module.exports = fetchUser;
