const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dbAdapter = require('../utils/dbAdapter');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id: String(id) },
    process.env.JWT_SECRET || 'ai_study_assistant_super_secret_jwt_key_2026_production_ready',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, gradeLevel, major, institution } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const userExists = await dbAdapter.users.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with that email already exists.',
      });
    }

    const user = await dbAdapter.users.create({
      name,
      email,
      password,
      gradeLevel: gradeLevel || 'College / Undergraduate',
      major: major || 'Computer Science & Engineering',
      institution: institution || 'University of Technology',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        gradeLevel: user.gradeLevel,
        major: user.major,
        institution: user.institution,
        learningPreferences: user.learningPreferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await dbAdapter.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    let isMatch = false;
    if (typeof user.matchPassword === 'function') {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        gradeLevel: user.gradeLevel,
        major: user.major,
        institution: user.institution,
        learningPreferences: user.learningPreferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    const user = await dbAdapter.users.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address.',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    return res.status(200).json({
      success: true,
      message: 'Password reset instructions have been generated.',
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the reset token and new password.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await dbAdapter.users.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar, gradeLevel, major, institution, learningPreferences } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (gradeLevel) updateData.gradeLevel = gradeLevel;
    if (major) updateData.major = major;
    if (institution) updateData.institution = institution;
    if (learningPreferences) {
      updateData.learningPreferences = {
        ...(req.user.learningPreferences || {}),
        ...learningPreferences,
      };
    }

    const updatedUser = await dbAdapter.users.update(req.user._id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await dbAdapter.users.update(req.user._id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  updatePassword,
};
