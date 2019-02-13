'use strict';
module.exports = (sequelize, DataTypes) => {
    const SequelizeMeta = sequelize.define('SequelizeMeta', {
        name: {
            type: DataTypes.STRING,
            primaryKey:true
        }
    },{
        tableName:'SequelizeMeta',
        timestamps:false
    });
    
    return SequelizeMeta;

}