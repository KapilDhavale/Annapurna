const jwt = require('jsonwebtoken');
const User = require('../models/user'); // make sure this matches your filename

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // role is optional; if not provided, the default in your model (provider) will be used
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Log in an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
