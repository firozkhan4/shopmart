import slugify from "slugify";
import { v7 as uuidv7 } from "uuid";

export default (sequelize, DataTypes) => {

  const Store = sequelize.define(
    "Store",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv7()
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "owner_id",
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "logo_url",
        validate: {
          isUrl: true,
        },
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      tableName: "stores",

      timestamps: true,

      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["slug"],
        },
        {
          fields: ["owner_id"],
        },
      ],

      hooks: {
        beforeValidate: (store) => {
          // Auto-generate slug if missing
          if (!store.slug && store.name) {
            store.slug = slugify(store.name, {
              lower: true,
              strict: true,
            });
          }
        },
      },
    }
  );


  Store.associate = (models) => {
    Store.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });
    Store.hasMany(models.Product, {foreignKey: "storeId", as: "products"})
  }
  return Store

}
