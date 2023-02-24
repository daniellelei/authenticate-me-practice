'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) =>{

   options.tableName = "ReviewImages";
   return queryInterface.bulkInsert(options, [
    {reviewId:2, url:"reviewImage1",},
    {reviewId:1, url:"reviewImage2",},
    {reviewId:3, url:"reviewImage3",},
    {reviewId:4, url:"reviewImage4",},
   ],{})
  },

  down: async (queryInterface, Sequelize)=> {

    options.tableName = "ReviewImages"
    
    return queryInterface.bulkDelete(options, null, {})
  }
};
