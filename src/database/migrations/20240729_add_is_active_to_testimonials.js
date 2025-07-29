'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists first
    const [results] = await queryInterface.sequelize.query(
      `SHOW COLUMNS FROM testimonials LIKE 'is_active'`
    );

    if (results.length === 0) {
      await queryInterface.addColumn('testimonials', 'is_active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('testimonials', 'is_active');
  }
};
