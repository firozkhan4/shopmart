import storeService from "../service/storeService.js";

const createStore = async (req, res) => {
  try {
    const { name, description, logoUrl } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Store name is required",
      });
    }

    const store = await storeService.createStore({
      name,
      description,
      logoUrl,
      ownerId: userId,
    });

    return res.status(201).json({
      success: true,
      data: store,
      message: "Store created successfully",
    });
  } catch (error) {
    console.error("Create Store Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create store",
    });
  }
};

/**
 * Get all stores
 */
const getAllStores = async (req, res) => {
  try {
    const stores = await storeService.getAllStores();

    return res.status(200).json({
      success: true,
      data: stores,
    });
  } catch (error) {
    console.error("Get Stores Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
};

/**
 * Get store by slug
 */
const getStoreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const store = await storeService.getStoreBySlug(slug);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    console.error("Get Store Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch store",
    });
  }
};

/**
 * Update store (owner only)
 */
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedStore = await storeService.updateStore(
      id,
      userId,
      req.body
    );

    if (!updatedStore) {
      return res.status(403).json({
        success: false,
        message: "Not authorized or store not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedStore,
      message: "Store updated successfully",
    });
  } catch (error) {
    console.error("Update Store Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update store",
    });
  }
};

/**
 * Delete store (owner only)
 */
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await storeService.deleteStore(id, userId);

    if (!deleted) {
      return res.status(403).json({
        success: false,
        message: "Not authorized or store not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.error("Delete Store Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete store",
    });
  }
};

export default {
  createStore,
  getAllStores,
  getStoreBySlug,
  updateStore,
  deleteStore,
};
