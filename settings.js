function settings(constraints){
// //contains your db connection
    const {connect} = require(`./control/engine.js`)

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
    let db_connection = connect(constraints.connection[0],constraints.connection[1])
    let app_name = constraints.app_name
    let structures = constraints.structures
    try{
        if(constraints.connection[0] == 'psql' && constraints.connection[1].idleTimeout){
            if(constraints.connection[1].idleTimeout < 2000){
                throw 'Please make sure the idleTimeout is greater than or equal to 2000'
            }
        }
    }catch(err){
        console.error(err)
    }
    // let idleTimeout = constraints.connection[1].idleTimeout ? constraints.connection[1].idleTimeout : 1000
    //structures location i:e the path to all your structures
    return {db_connection,app_name,structures}
}

module.exports = settings