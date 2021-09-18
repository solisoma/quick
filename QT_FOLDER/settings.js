//contains your db connection
const {RootDirectory} = require(`${process.cwd()}/accessor.js`)
const {connect} = require(`${RootDirectory}/control/engine.js`)

//db connection instance

/*      examples
for sqlite3 if in memory it should be db_connection = connect('sqlite3',':memory:')

for sqlite3 if disk file database it should be db_connection = connect('sqlite3','//location of the disk')

for mysql it should be db_connection = connect('mysql',{
                                                host://host,
                                                user://user,
                                                password://password
                                                database://database
                                            })

for psql it should be db_connection = connect('psql',{
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
let db_connection = `eg connect('psql',{
                                //user:'postgres',
                                //host:'localhost',
                                //database:'postgres',
                                //password:'qt',
                            })`
let app_name = 'eg xatisfy'
let structures = `eg ['./structure.js']`
//structures location i:e the path to all your structures

module.exports = {db_connection,app_name,structures}