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
        email: 'user1@user.com',
        firstName: 'user1firstName',
        lastName: "user1lastName",
        username: 'user1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'user2@user.com',
        firstName: "user2firstName",
        lastName: "user2lastName",
        username: 'user2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user3@user.com',
        firstName: "user3firstName",
        lastName: "user3lastName",
        username: 'user3',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: "user4@user.com",
        firstName:"user4firstName",
        lastName: "user4lastName",
        username: "user4",
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: "DemoUser@user.com",
        firstName:"Demo firstName",
        lastName: "Demo lastName",
        username: "demoUser",
        hashedPassword: bcrypt.hashSync('demoUser')
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
