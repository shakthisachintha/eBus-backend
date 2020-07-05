const jwt = require("jsonwebtoken");


function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, no token provided");
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(401).send("Access denied, invalid token provided");

  }
}

module.exports = auth;