import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {

  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    passwordHash: {
      type: DataTypes.STRING, // Store bcrypt/argon2 hash
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    resetPasswordExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
    {
      tableName: "users",
      timestamps: true, // createdAt, updatedAt
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Store, { foreignKey: "ownerId", as: "owner_id" })
  }

  User.prototype.setPassword = async function(password) {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(password, salt);
  };

  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;

}
