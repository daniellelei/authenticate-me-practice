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
      ownerId: 1, 
      address: "222 Denton Ave",
      city: "Index",
      state: "Washington",
      country: "United States",
      lat: 37.7645358,
      lng: 122.4730327,
      name: "The Treeframe Cabin",
      description: "Outrageously beautiful modern treehouse aframe cabin perched 13ft off the ground between 4 evergreen trees. ",
      price: 473.00,

    },
    {
      ownerId: 2, 
      address: "100 Valley Blvd",
      city: "Branson",
      state: "Missouri",
      country: "United States",
      lat: 42.3455655,
      lng: 50.345555,
      name: "Tree+House at Indian Point",
      description: "Welcome to the Tree + House at Indian Point! This is a custom built luxury modern treehouse for four.",
      price: 279,

    },
    {
      ownerId: 3, 
      address: "564 Hellman Ave",
      city: "Crane Hill",
      state: "Alabama",
      country: "United State",
      lat: 23.5657773,
      lng: 91.3344542,
      name: "Wanderlust TreeHouse",
      description: "Our very unique treehouse is nestled into the treetops on 40 acres of completely secluded property. ",
      price: 350,

    },
    {
      ownerId: 4, 
      address: "123 Elizabeth Ave",
      city: "Skyomish",
      state: "Washington",
      country: "United States",
      lat: 12.5657773,
      lng: 109.3344542,
      name: "SkyCabin",
      description: "Whether you have come for unprecedented adventure or uninterrupted serenity, here at SkyCabin, the experience you are seeking is always within reach. ",
      price: 143,
    }
   ],{})
  },

   down:async (queryInterface, Sequelize) => {
  
    options.tableName = 'Spots';
    
    return queryInterface.bulkDelete(options, null ,{})
  }
};
