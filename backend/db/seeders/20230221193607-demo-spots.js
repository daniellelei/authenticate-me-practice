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
   await queryInterface.bulkInsert("Spots",[
    {
      ownerId: 4, 
      address: "222 Denton Ave",
      city: "Rosemead",
      state: "California",
      country: "US",
      lat: 37.7645358,
      lng: 122.4730327,
      name: "Old house",
      description: "This is an old house",
      price: 100.00,

    },
    {
      ownerId: 3, 
      address: "100 Valley Blvd",
      city: "Alhambra",
      state: "California",
      country: "US",
      lat: 42.3455655,
      lng: 50.345555,
      name: "Jeff Bezos' house",
      description: "Jeff Bezos lives here",
      price: 200,

    },
    {
      ownerId: 4, 
      address: "564 Hellman Ave",
      city: "Monterey Park",
      state: "California",
      country: "US",
      lat: 23.5657773,
      lng: 91.3344542,
      name: "Feels like home",
      description: "It is near the freeway",
      price: 80,

    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Spots', null)
  }
};
