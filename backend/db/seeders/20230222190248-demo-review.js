'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Reviews', [
    {spotId: 1, userId:2, review: "I love this place.", stars:4,},
    {spotId: 2, userId:1, review: "This place is not very clean", stars:2,},
    {spotId: 3, userId:4, review: "It is nice to stay.", stars:4,},
    {spotId: 4, userId:3, review: "Will come back", stars:5,},
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Reviews', null)
  }
};
