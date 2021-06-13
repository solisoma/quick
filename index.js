//contains your db connection
const engine = require('./control/engine.js')

//db connection instance

/*      examples
for sqlite3 if in memory it should be db_connection = connect('sqlite3',':memory:')

for sqlite3 if disk file database it should be db_connection = connect('sqlite3','//location of the disk')

for mysql it should be db_connection = connect('mysql',{
                                                host://host,
                                                user://user,
                                                password://password
                                            })

for pgsql it should be db_connection = connect('psql',{
                                                user://user,
                                                host://host,
                                                database://database,
                                                password://password,
                                                port://port, optional
                                                ssl://false, optional
                                                max://30, optional
                                                idleTimeoutMillis://1000, optional
                                                connectionTimeoutMillis://1000, optional
                                                maxUses://7500 optional
                                            })
*/
let db_connection = engine.connect('psql',{
                                                user:'postgres',
                                                host:'localhost',
                                                database:'postgres',
                                                password:'ikechukwu',
                                            })

//structures location i:e te path to all your structures

let structure_locations = ['./structure']

module.exports = {db_connection:db_connection,structure_locations:structure_locations }