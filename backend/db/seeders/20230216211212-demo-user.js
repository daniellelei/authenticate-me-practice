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
        email: 'user1@gmail.com',
        username: 'user1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'user2@user.io',
        firstName: "John",
        lastName: "Smith",
        username: 'user2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user3@user.io',
        firstName: "Jeff",
        lastName: "Bezos",
        username: 'user3',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: "user4@hotmail.com",
        firstName:"Cardi",
        lastName: "B",
        username: "user4",
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'willsmith@google.com',
        username: 'user5',
        firstName: 'Will',
        lastName: 'Smith',
        hashedPassword: bcrypt.hashSync('password5')
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    //   username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    // }, {});
    await queryInterface.bulkDelete('Users', null)
  }
};
