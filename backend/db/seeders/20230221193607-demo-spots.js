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
      description: "Outrageously beautiful modern treehouse aframe cabin perched 13ft off the ground between 4 evergreen trees. Brand new with luxurious finishes, a two person hot tub, full bathroom, fireplace, giant skylights, and a king bed sleeping loft. We proudly donate portions of guest proceeds to The Sierra Club, Forterra (saved Lake Serene Trail), WTA, and The Tulalip Foundation.",
      price: 473.00,

    },
    {
      ownerId: 3, 
      address: "100 Valley Blvd",
      city: "Branson",
      state: "Missouri",
      country: "United States",
      lat: 42.3455655,
      lng: 50.345555,
      name: "Tree+House at Indian Point",
      description: "Welcome to the Tree + House at Indian Point! This is a custom built luxury modern treehouse for four. It's tucked neatly in the forest with walls of windows and breath taking views of Table Rock Lake.  Close proximity to Table Rock Lake and Silver Dollar City.",
      price: 279,

    },
    {
      ownerId: 4, 
      address: "564 Hellman Ave",
      city: "Crane Hill",
      state: "Alabama",
      country: "United State",
      lat: 23.5657773,
      lng: 91.3344542,
      name: "Wanderlust TreeHouse",
      description: "Our very unique treehouse is nestled into the treetops on 40 acres of completely secluded property. Great for a couples retreat, honeymoon, or spiritual reconnecting. Get away from it all and enjoy the nature trails and 2 acre lake(seasonal at times)to pass the time and be able to really unwind. Sit and enjoy your morning coffee outside on the deck as you may be able to catch a peak at the deer and other small animals making their way. ",
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
      description: "Whether you have come for unprecedented adventure or uninterrupted serenity, here at SkyCabin, the experience you are seeking is always within reach. Tucked away among evergreens in the quaint town of Skykomish, it offers the perfect combination of modern comfort and rustic charm. Centrally located to all that the Pacific Northwest has to offer, you will be just 16 miles from the Stevens ",
      price: 143,
    }
   ],{})
  },

   down:async (queryInterface, Sequelize) => {
  
    options.tableName = 'Spots';
    
    return queryInterface.bulkDelete(options, null ,{})
  }
};
