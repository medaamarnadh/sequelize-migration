const _ = require('underscore');  
const fs = require('fs');
const async = require('async');

/**
 * Loading module with db instance
 */
module.exports = (db)=> {
    var migrationPath;
    var migrationFiles;
    var seedPath;
    var seedFiles;
    
    async function config(configs){        
        console.log(configs.migrationPath);
        migrationPath = configs.migrationPath;
        
        migrationFiles = fs.readdirSync(configs.migrationPath);
        seedPath = configs.seedPath;
        if(fs.existsSync(configs.seedPath)){
            seedFiles = fs.readdirSync(configs.seedPath);
        }else{
            seedFiles = [];
        }
        
        
        var rows  = await db.sequelize.query('SELECT name FROM sqlite_master WHERE type="table"',{ plain:true,type: db.sequelize.QueryTypes.SELECT ,raw:true});
        
        if(rows.indexOf('SequelizeMeta') === -1){
            
            await db.sequelize.queryInterface.createTable('SequelizeMeta',{
                name:{
                    type: db.Sequelize.STRING,
                    primaryKey:true
                }
            });
            console.log('SequelizeMeta created successfully');
        }

        if(rows.indexOf('SequelizeData') === -1){
            console.log('Came tp SequelizeData');
            await db.sequelize.queryInterface.createTable('SequelizeData',{
                name:{
                    type: db.Sequelize.STRING,
                    primaryKey:true
                }
            });
            console.log('SequelizData created successfully');
        }
//Loading SequelizeMeta and SequelizeData for migrations and seeders tracking
        db['SequelizeMeta'] = db.sequelize['import']('SequelizeMeta',require('./SequelizeMeta'));
        db['SequelizeData'] = db.sequelize['import']('SequelizeData', require('./SequelizeData'));
    }

/**
 * Method for migration process of migration files.
 */
    async function Migrate(callback){
        var storedMigrations = await db.SequelizeMeta.findAll({where:{},raw:true});
        
        const allList = _.pluck(storedMigrations,'name');
        
        var pendingList = [];
        if(migrationFiles.length){
            pendingList = migrationFiles.filter(ele=> {
                return allList.indexOf(ele) === -1;
            });

            if(pendingList.length){
                async.eachSeries(pendingList,function(file,callback){
                    let module = require(migrationPath+'/'+file);                    
                     module.down(db.sequelize.queryInterface,db.Sequelize).then(function(){
                        return module.up(db.sequelize.queryInterface,db.Sequelize);
                     }).then(function(){
                        return db.SequelizeMeta.create({name:file}).then(function(result){
                            callback(null);
                        });
                     }); 
                    
                },function(err){
                    if(err){
                        callback(err,null);
                    }else{
                        callback(null,true);
                    }
                }); 
            }else{
                console.log('There are no pending migrations');
                callback(null,true);
            }
        }
    }

/**
 * Method for migration process for seeders
 */
    async function migrationSeed(callback){
        
        var pendingFiles;
        var storageSeeds = await db.SequelizeData.findAll({where:{},raw:true});
        storageSeeds = _.pluck(storageSeeds,'name');
        pendingFiles = seedFiles.filter(ele => {
            return storageSeeds.indexOf(ele) === -1;
        });

        async.eachSeries(pendingFiles,function(file,callback){
            let module = require(seedPath+'/'+file);
            module.down(db.sequelize.queryInterface,db.Sequelize)
            .then(function(){
               return module.up(db.sequelize.queryInterface,db.Sequelize)
            }).then(function(){
                db.SequelizeData.create({
                    name:file
                }).then(function(result){
                    console.log('Successfully updated seed:::',file)
                    callback(null);
                });
            }).catch(err => {
                callback(err,null);
            })            
        },function(err){
            if(err){                
                callback(err,null);
            }else{
                
                callback(null,true);
            }
        });        
    }


    return {
        migrate:Migrate,
        config:config,
        migrationSeed: migrationSeed
    }
}