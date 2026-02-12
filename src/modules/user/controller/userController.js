import userService from "../service/userService.js";

/**
 * Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

/**
 * Create user (Register)
 */
export const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await userService.createUser({
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Create User Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update user
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await userService.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
