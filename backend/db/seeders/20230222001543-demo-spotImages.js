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
    {spotId:5, url:"https://a0.muscache.com/im/pictures/d7f2828f-3287-4d8c-ba1a-8222e0dfdbdc.jpg?im_w=1200", preview: true,},
    {spotId:5, url:"https://a0.muscache.com/im/pictures/be85d149-e6f1-493d-8902-8c38511c4d35.jpg?im_w=720", preview: true,},
    {spotId:5, url:"https://a0.muscache.com/im/pictures/72d8ed5a-d507-43f6-8daf-94a9129396f6.jpg?im_w=1200", preview: true,},
    {spotId:5, url:"https://a0.muscache.com/im/pictures/b182997c-c5b6-4cba-ab4a-52c6c4dccf67.jpg?im_w=1200", preview: true,},
    {spotId:5, url:"https://a0.muscache.com/im/pictures/51ad0c1e-d8f4-46c0-96ce-dc06cb92efe8.jpg?im_w=1440", preview: true,},
    {spotId:6, url:"https://a0.muscache.com/im/pictures/miso/Hosting-31202365/original/bed11433-68e5-45bb-8ad6-112783ee5297.jpeg?im_w=1200", preview: true,},
    {spotId:6, url:"https://a0.muscache.com/im/pictures/miso/Hosting-31202365/original/a6eb786d-795a-4464-a805-ab2b63f90a3c.jpeg?im_w=720", preview: true,},
    {spotId:6, url:"https://a0.muscache.com/im/pictures/miso/Hosting-31202365/original/4fd051c8-e792-4634-95a1-71b20f9f1f7f.jpeg?im_w=1200", preview: true,},
    {spotId:6, url:"https://a0.muscache.com/im/pictures/3716075a-d2d8-48fb-8f06-0078e939ae5b.jpg?im_w=720", preview: true,},
    {spotId:6, url:"https://a0.muscache.com/im/pictures/miso/Hosting-31202365/original/a6eb786d-795a-4464-a805-ab2b63f90a3c.jpeg?im_w=720", preview: true,},
    {spotId:7, url:"https://hipcamp-res.cloudinary.com/f_auto,c_limit,w_950,q_80/v1602469351/campground-photos/j2mf7rfvguwnhf1mxvyi.jpg", preview: true,},
    {spotId:7, url:"https://hipcamp-res.cloudinary.com/f_auto,c_limit,w_950,q_80/v1622478804/campground-photos/islsiksldynbwrz2fr5c.jpg", preview: true,},
    {spotId:7, url:"https://hipcamp-res.cloudinary.com/f_auto,c_limit,w_1120,q_60/v1599326046/campground-photos/cp9hyvmb0pdt98e49hh1.jpg", preview: true,},
    {spotId:7, url:"https://hipcamp-res.cloudinary.com/f_auto,c_limit,w_1120,q_60/v1576717748/campground-photos/d2yezgvuzhlddxtokhiq.jpg", preview: true,},
    {spotId:7, url:"https://hipcamp-res.cloudinary.com/f_auto,c_limit,w_1120,q_60/v1599323926/campground-photos/nk2mwiuxz2w0yfhnw5r4.jpg", preview: true,},
    {spotId:8, url:"https://a0.muscache.com/im/pictures/miso/Hosting-49909749/original/a3c98649-ef18-4564-adb5-8ca6a0a382eb.jpeg?im_w=720", preview: true,},
    {spotId:8, url:"https://a0.muscache.com/im/pictures/4fd63a3b-2f37-41a3-9e09-8a1d08eb3467.jpg?im_w=720", preview: true,},
    {spotId:8, url:"https://a0.muscache.com/im/pictures/miso/Hosting-49909749/original/2cf97c23-d7d2-4522-af05-0598edbac490.jpeg?im_w=1200", preview: true,},
    {spotId:8, url:"https://a0.muscache.com/im/pictures/906b5f3d-2b71-457e-9239-e18649a35dc5.jpg?im_w=720", preview: true,},
    {spotId:8, url:"https://a0.muscache.com/im/pictures/a631ced7-9eed-476b-bde0-7ddcade9a413.jpg?im_w=720", preview: true,},
    {spotId:9, url:"https://a0.muscache.com/im/pictures/fd767e1c-0d99-4b36-ba62-bf92d17bf0de.jpg?im_w=1200", preview: true,},
    {spotId:9, url:"https://a0.muscache.com/im/pictures/303f7fed-917d-451b-be51-d0a640643285.jpg?im_w=720", preview: true,},
    {spotId:9, url:"https://a0.muscache.com/im/pictures/fa0f32c2-470e-407c-ba5e-612fcf2d501f.jpg?im_w=720", preview: true,},
    {spotId:9, url:"https://a0.muscache.com/im/pictures/dc2b6b22-7bcd-4ec7-8f51-c511b8a672a0.jpg?im_w=1200", preview: true,},
    {spotId:9, url:"https://a0.muscache.com/im/pictures/90d9e8ea-2946-4f3d-becd-188ae5fdd496.jpg?im_w=1200", preview: true,},
    {spotId:10, url:"https://a0.muscache.com/im/pictures/prohost-api/Hosting-648492249743613668/original/fc7c62b7-cdba-400b-955b-8540794e9dce.jpeg?im_w=720", preview: true,},
    {spotId:10, url:"https://a0.muscache.com/im/pictures/prohost-api/Hosting-648492249743613668/original/cd2504e4-54d7-48d9-8c14-a9fc80f92d0a.jpeg?im_w=1200", preview: true,},
    {spotId:10, url:"https://a0.muscache.com/im/pictures/prohost-api/Hosting-648492249743613668/original/73607598-390c-4154-8ef7-6b1a4a8fc56b.jpeg?im_w=720", preview: true,},
    {spotId:10, url:"https://a0.muscache.com/im/pictures/prohost-api/Hosting-648492249743613668/original/020f04de-66bf-4535-85c8-da6d074dad86.jpeg?im_w=1200", preview: true,},
    {spotId:10, url:"https://a0.muscache.com/im/pictures/prohost-api/Hosting-648492249743613668/original/aaf933b1-1468-4620-b8dd-6a016c5e4d59.jpeg?im_w=1200", preview: true,},
    {spotId:11, url:"https://a0.muscache.com/im/pictures/miso/Hosting-153903/original/c922d4af-d8f2-4d17-83fd-3a8d0554facf.jpeg?im_w=960", preview: true,},
    {spotId:11, url:"https://a0.muscache.com/im/pictures/miso/Hosting-153903/original/43b644c0-0477-4bdd-9dac-b2069ca49e66.jpeg?im_w=720", preview: true,},
    {spotId:11, url:"https://a0.muscache.com/im/pictures/1234056/174bb9d7_original.jpg?im_w=720", preview: true,},
    {spotId:11, url:"https://a0.muscache.com/im/pictures/miso/Hosting-153903/original/00526133-cbb5-4da4-91de-f721e27d509a.jpeg?im_w=1200", preview: true,},
    {spotId:11, url:"https://a0.muscache.com/im/pictures/1233992/10a35aca_original.jpg?im_w=720", preview: true,},
    {spotId:12, url:"https://a0.muscache.com/im/pictures/1983e314-a360-47e0-8a07-2575dc68a46e.jpg?im_w=720", preview: true,},
    {spotId:12, url:"https://a0.muscache.com/im/pictures/miso/Hosting-684177103575640815/original/cacefb6b-4de2-4ed0-8e13-94bbe3c7b491.jpeg?im_w=720", preview: true,},
    {spotId:12, url:"https://a0.muscache.com/im/pictures/miso/Hosting-684177103575640815/original/a8007e67-4d03-4bc4-91ea-e61f4d928663.jpeg?im_w=1200", preview: true,},
    {spotId:12, url:"https://a0.muscache.com/im/pictures/cfa93a35-ca98-4cf2-8e9b-3156daacd574.jpg?im_w=720", preview: true,},
    {spotId:12, url:"https://a0.muscache.com/im/pictures/miso/Hosting-684177103575640815/original/3fdb808a-0b4b-4f87-96dc-e972174a8eef.jpeg?im_w=720", preview: true,},
    {spotId:13, url:"https://a0.muscache.com/im/pictures/af8160e6-40c9-4123-b39d-95cd9121cdcd.jpg?im_w=1200", preview: true,},
    {spotId:13, url:"https://a0.muscache.com/im/pictures/52a341d2-b3b1-4d13-8edc-87a42b73a242.jpg?im_w=720", preview: true,},
    {spotId:13, url:"https://a0.muscache.com/im/pictures/miso/Hosting-24720030/original/72bfb174-8b13-4ecf-90ef-be088247271f.jpeg?im_w=720", preview: true,},
    {spotId:13, url:"https://a0.muscache.com/im/pictures/miso/Hosting-24720030/original/ce21b9aa-8e06-4c65-b7a3-001c27e51463.jpeg?im_w=720", preview: true,},
    {spotId:13, url:"https://a0.muscache.com/im/pictures/ce0113be-533d-4442-9dd4-0616d8417796.jpg?im_w=720", preview: true,},
   ],{})
  },

  down: async (queryInterface, Sequelize) => {

    options.tableName ="SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null,{});
  }
};
