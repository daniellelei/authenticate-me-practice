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
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'johnSmith@user.io',
        firstName: "John",
        lastName: "Smith",
        username: 'johnSmith',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'jeffBezos@user.io',
        firstName: "Jeff",
        lastName: "Bezos",
        username: 'jeffBezos',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: "cardiB@hotmail.com",
        firstName:"Cardi",
        lastName: "B",
        username: "cardiB",
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'willsmith@google.com',
        username: 'willSmith',
        firstName: 'Will',
        lastName: 'Smith',
        hashedPassword: bcrypt.hashSync('willsecretpassword')
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
