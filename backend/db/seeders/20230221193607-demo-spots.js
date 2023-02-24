'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    
   options.tableName = 'Spots';
   return queryInterface.bulkInsert(options,[
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

    },
    {
      ownerId: 4, 
      address: "123 Elizabeth Ave",
      city: "Monterey Park",
      state: "California",
      country: "US",
      lat: 12.5657773,
      lng: 109.3344542,
      name: "Cardi's Castle",
      description: "Cardi lives here",
      price: 180,

    }
   ],{})
  },

   down:async (queryInterface, Sequelize) => {
  
    options.tableName = 'Spots';
    
    return queryInterface.bulkDelete(options, null ,{})
  }
};
