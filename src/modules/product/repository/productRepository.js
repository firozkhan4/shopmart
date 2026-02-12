import { Op } from "sequelize";
import db from "../../../database/models/index.js";

const { Product } = db;

/**
 * Create Product
 */
const create = async (data) => {
  return await Product.create(data);
};

/**
 * Find All Products (With Pagination + Search)
 */
const findAll = async (filters) => {
  const {
    limit = 10,
    offset = 0,
    search,
    storeId,
  } = filters;

  const where = {};

  // Filter by store
  if (storeId) {
    where.storeId = storeId;
  }

  // Search by name
  if (search) {
    where.name = {
      [Op.iLike]: `%${search}%`, // For Postgres
      // Use Op.like for MySQL
    };
  }

  const { rows, count } = await Product.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    pageSize: limit,
    currentPage: Math.floor(offset / limit) + 1,
    data: rows,
  };
};

/**
 * Find Product By ID
 */
const findById = async (id) => {
  return await Product.findByPk(id);
};

/**
 * Update Product
 */
const update = async (id, data) => {
  await Product.update(data, {
    where: { id },
  });

  return await findById(id);
};

/**
 * Delete Product
 */
const remove = async (id) => {
  return await Product.destroy({
    where: { id },
  });
};

export default {
  create,
  findAll,
  findById,
  update,
  delete: remove,
};
