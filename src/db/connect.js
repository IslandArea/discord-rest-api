/**
 * @author Czekin (https://github.com/Czekin)
 * @name DB Connect
 * @description Connecting to DB and stores infos.
 * @version 1
 */

const rDB = require('rethinkdb');
const { dbCheck, tableCheck } = require('./load/check');
const deasync = require('deasync');

const botDbName = process.env.BOT_DB;
const restDbName = process.env.REST_DB;

/**
 * @var connection
 * @type {rDB.Connection}
 */
let connection = null;

/**
 * @method connect
 * @param {string} host     - DataBase IP
 * @param {number} port     - DataBase Port
 * 
 * @callback error
 * @callback connection
 */

rDB.connect({
    host: process.env.DB_IP,
    port: process.env.DB_PORT
}, (err, conn) => {
    if (err) throw err;

    connection = conn;
    console.info('[DB] Connecting to rethinkDB...');
});

while (connection == null) deasync.sleep(100);

/**
 * @constant botDB
 * @description RethinkDB Bot DataBase
 * @type {rDB.Db}
 */
const botDB = rDB.db(botDbName);

/**
 * @constant restDB
 * @description RethinkDB REST API DataBase
 * @type {rDB.Db}
 */
const restDB = rDB.db(restDbName);

/**
 * Check if Discord Bot DataBase exists
 */
dbCheck(botDB, connection, botDbName, 'userData').catch(err => console.log(err)).then(() => {

    /**
     * Check if botDB Table 'userData' exists
     */
    tableCheck(botDB, connection, botDbName, 'userData').catch(err => console.log(err)).then(() => {

        /**
         * Check if botDB Table 'badges' exists
         */
        tableCheck(botDB, connection, botDbName, 'badges').catch(err => console.log(err));
    });
});

/**
 * Check if REST API DataBase exists
 */
dbCheck(restDB, connection, restDbName, 'users').catch(err => console.log(err)).then(() => {

    /**
     * Check if restDB Table 'users' exists
     */
    tableCheck(restDB, connection, restDbName, 'users').catch(err => console.log(err));
});

console.info(`[DB] Connected to DB on port ${process.env.DB_PORT}`);

/**
 * @module Connect
 *
 * @exports rethinkDB  - RethinkDB Module
 * @exports connection - DataBase current connection object
 * @exports db('bot')  - `bot` DataBase
 * @exports userDataDB - `userData` DataBase Table
 * @exports badgesDB   - `badges` DataBase Table
 */
module.exports = {
    /**
     * @module rethinkDB
     * @description `rethinkdb` imported module
     * @type {rDB}
     */
    rethinkDB: rDB,

    /**
     * @module dbConn
     * @description Current connection to DataBase
     * @type {rDB.Connection}
     */
    dbConn: connection,

    /**
     * @module botDB
     * @description `Discord Bot` DataBase
     * @type {rDB.Db}
     */
    botDB: botDB,

    /**
     * @module restDB
     * @description `rest api` DataBase
     * @type {rDB.Db}
     */
    restDB: restDB,

    /**
     * @module userDataDB
     * @description `userData` DataBase Table
     * @type {rDB.Table}
     */
    userDataDB: botDB.table('userData'),

    /**
     * @module badgesDB
     * @description `badges` DataBase Table
     * @type {rDB.Table}
     */
    badgesDB: botDB.table('badges'),

    /**
     * @module badgesDB
     * @description `users` DataBase Table
     * @type {rDB.Table}
     */
    usersDB: restDB.table('users')
}