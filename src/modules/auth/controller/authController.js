import authService from "../service/authService.js";

/**
 * Register User
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.register({
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.login({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials",
    });
  }
};

/**
 * Get Logged-in User Profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res) => {
  try {
    // Injected by authMiddleware
    const userId = req.user.id;

    const user = await authService.getProfile(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export default {
  register,
  login,
  getProfile,
};
