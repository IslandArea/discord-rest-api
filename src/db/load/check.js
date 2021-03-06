const rDB = require('rethinkdb');

module.exports = {
    /**
     * @module dbCheck
     * @param {rDB.Db} db                 - RethinkDB DataBase
     * @param {rDB.Connection} connection - RethinkDB Connection
     * @param {string} dbName             - DataBase name
     * @param {string} tableName          - First DataBase Table name
     */
    dbCheck: (db, connection, dbName, tableName) => new Promise((resolve, reject) => {
        db.tableList().run(connection, (err) => {
            if (!err) {
                resolve();
            } else if (err.name == 'ReqlOpFailedError' && err.message.startsWith(`Database \`${dbName}\` does not exist`)) {
                rDB.dbCreate(dbName).run(connection).then(callback => {
                    db.tableCreate(tableName).run(connection).catch(err => reject(err)).then(callback => {
                        console.log(`Created DataBase: ${dbName} and new Table: ${tableName}`);

                        resolve();
                    });
                }).catch(err => { if (err) reject(err) });
            } else {
                throw new Error(err);
            }
        })
    }),

    /**
     * @module tableCheck
     * @param {rDB.Db} db                 - RethinkDB DataBase
     * @param {rDB.Connection} connection - RethinkDB Connection
     * @param {string} dbName             - RethinkDB DataBase name
     * @param {string} tableName          - DataBase Table name
     */
    tableCheck: (db, connection, dbName, tableName) => new Promise((resolve, reject) => {
        db.table(tableName).filter({}).run(connection, (err) => {
            if (!err) {
                resolve();
            } else if (err.name == 'ReqlOpFailedError' && err.message.startsWith(`Table \`${dbName}.${tableName}\` does not exist`)) {
                db.tableCreate(tableName).run(connection).catch(err => reject(err)).then(callback => {
                    console.log(`Created table: ${tableName} in DataBase: ${dbName}`);

                    resolve();
                });
            } else {
                throw new Error(err);
            }
        });
    })
}