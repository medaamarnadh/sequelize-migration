'use strict';
module.exports = (sequelize, DataTypes) => {
    const SequelizeData = sequelize.define('SequelizeData', {
        name: {
            type: DataTypes.STRING,
            primaryKey:true
        }
    },{
        tableName:'SequelizeData',
        timestamps:false
    });
    
    return SequelizeData;

}