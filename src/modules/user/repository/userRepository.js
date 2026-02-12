import db from "../../../database/models/index.js";
const { User } = db;

const findAll = async () => {
  return await User.findAll();
};

const findById = async (id) => {
  return await User.findByPk(id);
};

const findByEmail = async (email) => {
  return await User.findOne({
    where: { email },
  });
};

const create = async (data) => {
  return await User.create(data);
};

const update = async (id, data) => {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }

  return await user.update(data);
};

const remove = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }

  return await user.destroy();
};

export default {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  delete: remove,
};
