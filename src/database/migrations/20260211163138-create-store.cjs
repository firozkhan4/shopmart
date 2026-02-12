'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("stores", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      owner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      logo_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Optional: index for faster lookup
    await queryInterface.addIndex("stores", ["owner_id"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("stores");
  },
};
