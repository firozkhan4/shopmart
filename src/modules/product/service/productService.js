import productRepository from "../repository/productRepository.js";

const createProduct = async (data, user) => {
  const {
    storeId,
    name,
    price,
  } = data;

  // Basic validation
  if (!storeId || !name || !price) {
    throw new Error("storeId, name, and price are required");
  }

  // // Optional: ownership/role check
  // if (user && user.role !== "ADMIN" && user.role !== "SELLER") {
  //   throw new Error("You are not authorized to create products");
  // }

  const productData = {
    storeId,
    name,
    description: data.description || null,
    price,
    stock: data.stock ?? 0,
    imageUrl: data.imageUrl || null,
  };

  return await productRepository.create(productData);
};

/**
 * Get All Products
 */
const getAllProducts = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    storeId,
  } = query;

  const offset = (page - 1) * limit;

  const filters = {
    offset: Number(offset),
    limit: Number(limit),
    search,
    storeId,
  };

  return await productRepository.findAll(filters);
};

/**
 * Get Product By ID
 */
const getProductById = async (id) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const product = await productRepository.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

/**
 * Update Product
 */
const updateProduct = async (id, data, user) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const product = await productRepository.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  // Authorization
  if (user && user.role !== "ADMIN" && user.role !== "SELLER") {
    throw new Error("You are not authorized to update this product");
  }

  const updatedData = {
    name: data.name ?? product.name,
    description: data.description ?? product.description,
    price: data.price ?? product.price,
    stock: data.stock ?? product.stock,
    imageUrl: data.imageUrl ?? product.imageUrl,
  };

  return await productRepository.update(id, updatedData);
};

/**
 * Delete Product
 */
const deleteProduct = async (id, user) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const product = await productRepository.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  // Authorization
  if (user && user.role !== "ADMIN" && user.role !== "SELLER") {
    throw new Error("You are not authorized to delete this product");
  }

  return await productRepository.delete(id);
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
