'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'johnnyK@gmail.com',
        firstName: 'Johnny',
        lastName: "Myers",
        username: 'JohnnyK',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'kenneth2@gmail.com',
        firstName: "Kenneth",
        lastName: "Gonzalez",
        username: 'KennethGon',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'frank3@hotmail.com',
        firstName: "Frank",
        lastName: "Altamirano",
        username: 'FrankAlta',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: "tania@user.com",
        firstName:"Tania",
        lastName: "Goncalves",
        username: "taniaGoncal",
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: "DemoUser@user.com",
        firstName:"Demo firstName",
        lastName: "Demo lastName",
        username: "demoUser",
        hashedPassword: bcrypt.hashSync('demoUser')
      },
      {
        email: 'jobwalker1@hotmail.com',
        firstName: "Job",
        lastName: "Walker",
        username: 'jobWalker1',
        hashedPassword: bcrypt.hashSync('jobwalker')
      },
      {
        email: "necati@gmail.com",
        firstName:"Necati",
        lastName: "Diessen",
        username: "necatiDiessen",
        hashedPassword: bcrypt.hashSync('password4')
      },

      

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
    //await queryInterface.bulkDelete('Users', null)
  }
};
