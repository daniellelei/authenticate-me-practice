'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {

   options.tableName = "Bookings";
   return queryInterface.bulkInsert(options, [
    {spotId:1, userId:4, startDate:"2024-03-17" , endDate:"2024-03-19"},
    {spotId:2, userId:3, startDate:"2023-02-17" , endDate:"2023-04-18" },
    {spotId:1, userId:3, startDate:"2023-04-11" , endDate:"2023-04-15" },
    {spotId:4, userId:3, startDate:"2023-06-01" , endDate:"2023-06-12" },
    {spotId:2, userId:3, startDate:"2023-07-17" , endDate:"2023-07-22" },
    {spotId:3, userId:2, startDate:"2023-03-15" , endDate:"2023-04-16" },
    {spotId:4, userId:1, startDate:"2023-06-17" , endDate:"2023-06-28" },
  
   ], {})
  },

  down: async (queryInterface, Sequelize) => {

    options.tableName = "Bookings"
 
    await queryInterface.bulkDelete(options, null,{});
  }
};
