'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) =>{
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = "ReviewImages";
   return queryInterface.bulkInsert(options, [
    {reviewId:2, url:"reviewImage1",},
    {reviewId:1, url:"reviewImage2",},
    {reviewId:3, url:"reviewImage3",},
    {reviewId:4, url:"reviewImage4",},
   ],{})
  },

  down: async (queryInterface, Sequelize)=> {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "ReviewImages"
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {[Op.in]:[1,2,3,4]}
    }, {})
  }
};
