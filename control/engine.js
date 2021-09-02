//engine house

//mysql connection
let mysql = (val)=>{

    let mysql = require('mysql');

    if(!mysql){
      console.log('sorry mysql cannot be found\nplease make sure mysql is installed in your system')
    }

    var conn = mysql.createConnection({
        host:val.host,
        user:val.user,
        password:val.password
    })

    return conn
}

//postgresql connection
let psql = (val)=>{

    const PG = require('pg-pool');

    let port = 5432
    let ssl = false
    let max = 30
    let idleTimeoutMillis = 1000
    let connectionTimeoutMillis = 1000
    let maxUses = 7500

    if(val.ssl){ssl = val.ssl}; if(val.max){max = val.max}; if(val.idleTimeoutMillis){connectionTimeoutMillis = val.idleTimeoutMillis};
    if(val.connectionTimeoutMillis){connectionTimeoutMillis = val.connectionTimeoutMillis}; if(val.maxUses){maxUses = val.maxUses}

    const conn = new PG({
        user:val.user,
        host:val.host,
        password:val.password,
        port:port,
        database: val.database,
        ssl:ssl,
        max:max,
        idleTimeoutMillis:idleTimeoutMillis,
        connectionTimeoutMillis:connectionTimeoutMillis,
        maxUses:maxUses
    })
    conn.connect((err,cl)=>{
        if(err) throw err
        cl.release()
    })
    return conn
}

//sqlite connection
let sqlite = (val)=>{

    let sqlite = require('sqlite3').verbose();

    if(!sqlite){
        console.log('sorry postgresql cannot be found\rplease make sure postgresql is installed in your system')
    }

    var conn = new sqlite.Database(val,err=>{
        if(err)throw err
    })
    return conn
}

let connect = (db_name,values)=>{
    var conn;
    if(db_name == 'mysql'){
        conn = mysql(values)
        mysql(value)
    }else if(db_name == 'psql'){
        conn = psql(values)
        psql(values)
    }else if(db_name == 'sqlite3'){
        conn = sqlite(values)
        sqlite(values)
    }
    return {db_name,connector:conn}
}

module.exports = {connect:connect}