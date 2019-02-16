'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('User',[{
      id:1,
      name:'Amar',
      email:'amar@gmail.com',
      address:'Hyderabad',
      updatedAt:new Date(),
      createdAt: new Date()
    },{
      id:2,
      name:'Jhon',
      email:'jhon@gmail.com',
      address:'Secunderabad',
      updatedAt:new Date(),
      createdAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
