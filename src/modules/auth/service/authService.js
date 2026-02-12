import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userRepository from "../../user/repository/userRepository.js";
import config from "../../../config.js";

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN || "1d",
    }
  );
};

/**
 * Register New User
 */
const register = async ({ email, password, role = "USER" }) => {
  // Check if user exists
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const user = await userRepository.create({
    email,
    passwordHash,
    role,
    isVerified: false,
  });

  // Generate token
  const token = generateToken(user);

  // Remove sensitive data
  const userData = user.toJSON();
  delete userData.passwordHash;

  return {
    user: userData,
    token,
  };
};

/**
 * Login User
 */
const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Update last login
  await userRepository.update(user.id, {
    lastLoginAt: new Date(),
  });

  // Generate token
  const token = generateToken(user);

  // Remove sensitive data
  const userData = user.toJSON();
  delete userData.passwordHash;

  return {
    user: userData,
    token,
  };
};

/**
 * Get Logged-in User Profile
 */
const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const data = user.toJSON();
  delete data.passwordHash;

  return data;
};

export default {
  register,
  login,
  getProfile,
};
