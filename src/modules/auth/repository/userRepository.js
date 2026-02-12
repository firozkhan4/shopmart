import User from "../../../database/models/index.js";


const findAll = async () => {
  const result = await User.findAll()
  return result;
}


export default {
  findAll
}

