const User = require('../models/user');
const { signToken } = require('../middleware/auth');

const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }

      const user = await User.create({ name, email, password });
      if (!user) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const token = signToken(user);
      res.status(201).json({ success: true, data: { user, token } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const user = await User.findByEmailAndPassword(email, password);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = signToken(user);
      res.json({ success: true, data: { user, token } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  me(req, res) {
    // req.user is set by authMiddleware
    const user = User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { user } });
  },
};

module.exports = AuthController;
