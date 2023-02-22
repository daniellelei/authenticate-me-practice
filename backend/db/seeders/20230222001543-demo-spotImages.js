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
   await queryInterface.bulkInsert('SpotImages',[
    {spotId:1, url:"https://cdn.houseplansservices.com/product/ba85c0b77197e478abcb7d5db867b4d6b45b0cd50b156c90dc3bae697cd0911c/w800x533.jpg?v=12", preview: true,},
    {spotId:2, url:"https://images.familyhomeplans.com/cdn-cgi/image/fit=contain,quality=85/pdf/pinterest/images/44207.jpg", preview:true},
    {spotId:3, url:"https://images.familyhomeplans.com/cdn-cgi/image/fit=contain,quality=85/pdf/pinterest/images/56937.jpg", preview: true,},
    {spotId:4, url:"https://images.familyhomeplans.com/cdn-cgi/image/fit=contain,quality=85/pdf/pinterest/images/50324.jpg", preview: true,},
    
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('SpotImages', null);
  }
};
