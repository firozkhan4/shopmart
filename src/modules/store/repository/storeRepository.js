import db from "../../../database/models/index.js";
const { User, Store } = db;

/**
 * Create store
 */
const create = async (data) => {
  return await Store.create(data);
};

/**
 * Find all stores
 */
const findAll = async () => {
  return await Store.findAll({
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

/**
 * Find store by slug
 */
const findBySlug = async (slug) => {
  return await Store.findOne({
    where: { slug },
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "email"],
      },
    ],
  });
};

/**
 * Find store by ID
 */
const findById = async (id) => {
  return await Store.findByPk(id);
};

/**
 * Update store
 */
const update = async (id, data) => {
  const store = await Store.findByPk(id);

  if (!store) return null;

  await store.update(data);

  return store;
};

/**
 * Delete store
 */
const remove = async (id) => {
  const store = await Store.findByPk(id);

  if (!store) return false;

  await store.destroy();

  return true;
};

export default {
  create,
  findAll,
  findBySlug,
  findById,
  update,
  delete: remove,
};
