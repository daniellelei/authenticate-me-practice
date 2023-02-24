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
   await queryInterface.bulkInsert('Bookings', [
    {spotId:1, userId:4, startDate:"2022-03-17" , endDate:"2022-03-19"},
    {spotId:2, userId:3, startDate:"2023-04-17" , endDate:"2023-04-18" },
    {spotId:3, userId:2, startDate:"2023-03-15" , endDate:"2022-04-16" },
    {spotId:4, userId:1, startDate:"2023-06-17" , endDate:"2022-06-28" },
  
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Bookings', null)
  }
};
