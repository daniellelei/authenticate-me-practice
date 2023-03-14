'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize)=> {

   options.tableName = 'SpotImages';
   return queryInterface.bulkInsert(options,[
    {spotId:1, url:"https://a0.muscache.com/im/pictures/miso/Hosting-49924321/original/bca57cdc-bc62-4366-91e9-03ba6c4059ee.jpeg?im_w=960", preview: true,},
    {spotId:1, url: "https://a0.muscache.com/im/pictures/miso/Hosting-49924321/original/bf91b1f5-1942-4ecd-95b0-328bb617c47e.jpeg?im_w=720", preview: true},
    {spotId:1, url:"https://a0.muscache.com/im/pictures/miso/Hosting-49924321/original/992ad5e1-78c8-43d4-9b69-a898d4ac21f6.jpeg?im_w=720", preview: true},
    {spotId:1, url:"https://a0.muscache.com/im/pictures/miso/Hosting-49924321/original/9348db93-1b50-47c0-9aff-11ead5facd22.jpeg?im_w=720", preview:true},
    {spotId:1, url:"https://a0.muscache.com/im/pictures/a7c25c65-91ab-45dd-81ac-9dcd60c34623.jpg?im_w=720", preview:true},
    {spotId:2, url:"imgURL spot2", preview:true},
    {spotId:3, url:"imgURL spot3", preview: true,},
    {spotId:4, url:"imgURL spot4", preview: true,},
    
   ],{})
  },

  down: async (queryInterface, Sequelize) => {

    options.tableName ="SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null,{});
  }
};
