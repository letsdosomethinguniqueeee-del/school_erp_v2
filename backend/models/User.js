const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin', 'teacher', 'student', 'parent', 'staff'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Custom encryption key (32 characters for AES-256)
const ENCRYPTION_KEY = 'g1nS,s@ws,sh@g123456789123456789';

// Improved encryption function (using createCipheriv with random IV)
function encryptPassword(password) {
  const iv = crypto.randomBytes(16); // Random IV for each encryption
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // IV:encrypted
}

// Improved decryption function
function decryptPassword(encryptedPassword) {
  const parts = encryptedPassword.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    try {
      // Encrypt password using custom encryption
      this.password = encryptPassword(this.password);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const decryptedPassword = decryptPassword(this.password);
    return decryptedPassword === candidatePassword;
  } catch (error) {
    return false;
  }
};

// Decrypt password for super admin access
userSchema.methods.getDecryptedPassword = function () {
  try {
    return decryptPassword(this.password);
  } catch (error) {
    return null;
  }
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.index({ userId: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);