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
    {spotId:1, url:"https://a0.muscache.com/im/pictures/miso/Hosting-49924321/original/354f8781-fd99-43ab-9617-316dd60da4b9.jpeg?im_w=720", preview:true},
    {spotId:1, url:"https://a0.muscache.com/im/pictures/a7c25c65-91ab-45dd-81ac-9dcd60c34623.jpg?im_w=720", preview:true},
    {spotId:2, url:"https://a0.muscache.com/im/pictures/miso/Hosting-618297070744530980/original/bb23b7d0-3471-446d-99db-b5e19c772dff.jpeg?im_w=960", preview:true},
    {spotId:2, url:"https://a0.muscache.com/im/pictures/miso/Hosting-618297070744530980/original/a77deca1-0ab3-4f2c-8332-56ef9d16c60a.jpeg?im_w=720", preview:true},
    {spotId:2, url:"https://a0.muscache.com/im/pictures/miso/Hosting-618297070744530980/original/fb661d76-06d5-4087-9f4b-ad1ac1024673.jpeg?im_w=720", preview:true},
    {spotId:2, url:"https://a0.muscache.com/im/pictures/0964ed97-fda5-4305-80ef-2b18ca0e49af.jpg?im_w=720", preview:true},
    {spotId:2, url:"https://a0.muscache.com/im/pictures/miso/Hosting-618297070744530980/original/1edbb243-8b9b-4756-ac1a-ca764903ac4f.jpeg?im_w=720", preview:true},
    {spotId:3, url:"https://a0.muscache.com/im/pictures/ffe7f9e4-2c94-4e9a-966a-942dfe56dfc9.jpg?im_w=720", preview: true,},
    {spotId:3, url:"https://a0.muscache.com/im/pictures/miso/Hosting-45016629/original/a8d7fd19-d21d-4cef-9c95-3194b621a3d4.jpeg?im_w=1200", preview: true,},
    {spotId:3, url:"https://a0.muscache.com/im/pictures/76172176-2e6f-4982-b6ef-a5ac32bc985a.jpg?im_w=720", preview: true,},
    {spotId:3, url:"https://a0.muscache.com/im/pictures/483af96a-8ba1-4965-bc3c-2261a4b2235c.jpg?im_w=720", preview: true,},
    {spotId:3, url:"https://a0.muscache.com/im/pictures/d996708a-44ba-4e08-a418-503cc2cb2fe1.jpg?im_w=720", preview: true,},
    {spotId:4, url:"https://a0.muscache.com/im/pictures/miso/Hosting-39119065/original/44bbd9eb-bc39-4438-bdc1-9455d3222ce9.jpeg?im_w=960", preview: true,},
    {spotId:4, url:"https://a0.muscache.com/im/pictures/miso/Hosting-39119065/original/ec411fe8-a39a-4745-9c70-1185e6ef1a2e.jpeg?im_w=720", preview: true,},
    {spotId:4, url:"https://a0.muscache.com/im/pictures/miso/Hosting-39119065/original/3bb23093-6e20-46d6-b9ae-6488b8c8f807.jpeg?im_w=720", preview: true,},
    {spotId:4, url:"https://a0.muscache.com/im/pictures/4c801fe5-6452-4367-b355-ecae5f4befca.jpg?im_w=1200", preview: true,},
    {spotId:4, url:"https://a0.muscache.com/im/pictures/0d906511-6259-4900-bd22-c811a2a536bc.jpg?im_w=1200", preview: true,},
    
   ],{})
  },

  down: async (queryInterface, Sequelize) => {

    options.tableName ="SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null,{});
  }
};
