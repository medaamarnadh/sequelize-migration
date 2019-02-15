Auto migration tool for ElectronJs and NodeJs applications for relational database (MSSQL, PostgreSQL,Sqlite3).

##Introduction
This is best solution to for schema migration for relational databases. No need to worry about schema migration between different environments. No manual efforts required such as [sequelize-cli!](https://www.npmjs.com/package/sequelize-cli).

We can automate migration process by passing sequelize instance to this module. 

###How it works
*sequelize-auto-migration* will take your migrations, seeders path and sequelize instance object. It will run all your migration files and seeders. It will store completed migrations in SequelizeMeta table and seeders in SequelizeData table same as sequelize-cli. 


