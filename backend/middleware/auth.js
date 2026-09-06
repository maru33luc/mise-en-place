const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mise-en-place-secret-key-dev';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/**
 * Middleware: verify Bearer token from Authorization header.
 * Attaches req.user = { id, name, email } on success.
 */
function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized — no token provided' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized — invalid or expired token' });
  }
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

module.exports = { authMiddleware, signToken };
