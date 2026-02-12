import userRepository from "../repository/userRepository.js";
import bcrypt from "bcrypt";

/**
 * Get all users
 */
const getAllUsers = async () => {
  const users = await userRepository.findAll();

  // Remove sensitive fields
  return users.map((user) => {
    const data = user.toJSON();
    delete data.passwordHash;
    return data;
  });
};

/**
 * Get user by ID
 */
const getUserById = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) return null;

  const data = user.toJSON();
  delete data.passwordHash;

  return data;
};

/**
 * Create user (Register)
 */
const createUser = async ({ email, password, role }) => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Save user
  const user = await userRepository.create({
    email,
    passwordHash,
    role,
  });

  const data = user.toJSON();
  delete data.passwordHash;

  return data;
};

/**
 * Update user
 */
const updateUser = async (id, payload) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  // If password change
  if (payload.password) {
    const salt = await bcrypt.genSalt(12);
    payload.passwordHash = await bcrypt.hash(payload.password, salt);
    delete payload.password;
  }

  const updatedUser = await userRepository.update(id, payload);

  const data = updatedUser.toJSON();
  delete data.passwordHash;

  return data;
};

/**
 * Delete user
 */
const deleteUser = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  await userRepository.delete(id);

  return true;
};

/**
 * Login user (Authentication)
 */
const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // Update last login
  await userRepository.update(user.id, {
    lastLoginAt: new Date(),
  });

  const data = user.toJSON();
  delete data.passwordHash;

  return data;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
};


