const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try { req.staff = jwt.verify(token, process.env.JWT_SECRET || 'development-secret'); next(); }
  catch (_error) { return res.status(401).json({ message: 'Invalid or expired token' }); }
}

module.exports = { authRequired };