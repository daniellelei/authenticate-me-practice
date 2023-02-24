'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {

   options.tableName ="Reviews"
   return queryInterface.bulkInsert(options, [
    {spotId: 1, userId:2, review: "I love this place.", stars:4,},
    {spotId: 2, userId:1, review: "This place is not very clean", stars:2,},
    {spotId: 3, userId:4, review: "It is nice to stay.", stars:4,},
    {spotId: 4, userId:3, review: "Will come back", stars:5,},
   ], {})
  },

  down: async (queryInterface, Sequelize)=> {
 
    options.tableName="Reviews";
 
    await queryInterface.bulkDelete(options, null,{});
  }
};
