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
      lat: 47.822675,
      lng: -121.558447,
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
      lat: 36.662620,
      lng: -93.289297,
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
      lat: 34.095524,
      lng: -87.065963,
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
      lat: 47.713869,
      lng: -121.365787,
      name: "SkyCabin",
      description: "Whether you have come for unprecedented adventure or uninterrupted serenity, here at SkyCabin, the experience you are seeking is always within reach. ",
      price: 143,
    },
    {
      ownerId: 5, 
      address: "123 Atlantic Ave",
      city: "Asheville",
      state: "North Carolina",
      country: "United States",
      lat: 35.645568,
      lng: -82.551223,
      name: "Sanctuary - Earth & Sky Dwellings",
      description: "Take in the rustic, fairy tale vibe of this custom-made treehouse in the midst of towering white oaks.  ",
      price: 200,
    },
    {
      ownerId: 5, 
      address: "100 Valley Ave",
      city: "Trenton",
      state: "Georgia",
      country: "United States",
      lat: 34.854059,
      lng: -85.513566,
      name: "Whippoorwill Retreat Treehouse",
      description: "Whippoorwill Retreat is nestled in treetops on Sand Mountain, 20 min. from Chattanooga, Tn. ",
      price: 100,
    },
    {
      ownerId: 1, 
      address: "32090 Via Bella Vita",
      city: "Temecula",
      state: "California",
      country: "United States",
      lat: 33.52430,
      lng: -117.11174,
      name: "Namaste Farms",
      description: "We purchased Namaste Farms in 1997 when I was showing reined cowhorses as well as raising thoroughbred racehorses. ",
      price: 173.00,

    },
    {
      ownerId: 2, 
      address: "111 Yosemite",
      city: "Oakhurst",
      state: "California",
      country: "United States",
      lat: 37.316802,
      lng: -119.642892,
      name: "🌲Insta-worthy Nature Cabin w/Queen Bed by Yosemite",
      description: "Calling all adventurers and nature lovers!!!",
      price: 116,

    },
    {
      ownerId: 3, 
      address: "5385 Cazadero Hwy",
      city: "Cazadero",
      state: "California",
      country: "United State",
      lat: 38.524214,
      lng: -123.088241,
      name: "Huckleberry-Modern Caz Tree House 1 bedroom 1 bath",
      description: "Set high above Austin Creek this modern Cazadero 1 bedroom 1 bath tree top home has 180 degree views of redwoods and the valley below.",
      price: 269,

    },
    {
      ownerId: 4, 
      address: "123 San Bernardino Ave",
      city: "San Bernardino",
      state: "California",
      country: "United States",
      lat: 34.221031,
      lng: -117.332802,
      name: "Stairway to Heaven w/ Lake View of Lake Arrowhead",
      description: "This beautifully remodeled 2-bedroom, 2 bath house in Lake Arrowhead has stunning lake views from all two levels of the house.",
      price: 169,
    },
    {
      ownerId: 5, 
      address: "123 Atlantic Ave",
      city: "Watsonville",
      state: "California",
      country: "United States",
      lat: 36.913129,
      lng: -121.789184,
      name: "Redwood Treehouse Santa Cruz Mtns.",
      description: "A magical Redwood Treehouse located it the beautiful Santa Cruz Mountains. ",
      price: 169,
    },
    
   ],{})
  },

   down:async (queryInterface, Sequelize) => {
  
    options.tableName = 'Spots';
    
    return queryInterface.bulkDelete(options, null ,{})
  }
};
