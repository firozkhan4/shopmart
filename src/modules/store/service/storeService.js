import storeRepository from "../repository/storeRepository.js";
import slugify from "slugify";

const createStore = async ({ name, description, logoUrl, ownerId }) => {
  // Generate unique slug
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 1;

  // Ensure slug uniqueness
  while (await storeRepository.findBySlug(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const store = await storeRepository.create({
    name,
    slug,
    description,
    logoUrl,
    ownerId,
  });

  return store;
};

/**
 * Get all stores
 */
const getAllStores = async () => {
  return await storeRepository.findAll();
};

/**
 * Get store by slug
 */
const getStoreBySlug = async (slug) => {
  return await storeRepository.findBySlug(slug);
};

/**
 * Update store (owner only)
 */
const updateStore = async (storeId, userId, data) => {
  const store = await storeRepository.findById(storeId);

  if (!store) return null;

  // Ownership check
  if (store.ownerId !== userId) {
    return null;
  }

  // If name changes → regenerate slug
  if (data.name && data.name !== store.name) {
    const baseSlug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (await storeRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    data.slug = slug;
  }

  return await storeRepository.update(storeId, data);
};

/**
 * Delete store (owner only)
 */
const deleteStore = async (storeId, userId) => {
  const store = await storeRepository.findById(storeId);

  if (!store) return false;

  // Ownership check
  if (store.ownerId !== userId) {
    return false;
  }

  await storeRepository.delete(storeId);

  return true;
};

export default {
  createStore,
  getAllStores,
  getStoreBySlug,
  updateStore,
  deleteStore,
};
