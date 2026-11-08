const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: 'Student passionate about learning and mastering new subjects with AI.',
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },
    gradeLevel: {
      type: String,
      enum: ['High School', 'College / Undergraduate', 'Graduate / Master', 'Postgraduate / PhD', 'Lifelong Learner'],
      default: 'College / Undergraduate',
    },
    major: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    institution: {
      type: String,
      default: 'University of Technology',
    },
    learningPreferences: {
      dailyGoalMinutes: {
        type: Number,
        default: 60,
      },
      preferredSubject: {
        type: String,
        default: 'Computer Science',
      },
      difficultyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Intermediate',
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
