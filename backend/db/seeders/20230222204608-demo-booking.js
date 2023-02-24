'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = "Bookings";
   return queryInterface.bulkInsert(options, [
    {spotId:1, userId:4, startDate:"2024-03-17" , endDate:"2024-03-19"},
    {spotId:2, userId:3, startDate:"2023-04-17" , endDate:"2023-04-18" },
    {spotId:3, userId:2, startDate:"2023-03-15" , endDate:"2022-04-16" },
    {spotId:4, userId:1, startDate:"2023-06-17" , endDate:"2022-06-28" },
  
   ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings"
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: {[Op.in]:[1,2,3,4]}
    },{});
  }
};
