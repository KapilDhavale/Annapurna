const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true }, // ✅ Ensures lowercase emails
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'provider', 'receiver'],
    default: 'provider'
  }
});

// ✅ Removed password hashing from schema to avoid double hashing
module.exports = mongoose.model('User', UserSchema);
