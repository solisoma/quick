//engine house

//mysql connection
let mysql = (val)=>{

    let mysql = require('mysql');

    if(!mysql){
      console.log('sorry mysql cannot be found\nplease make sure mysql is installed in your system')
    }

    // var conn = mysql.createConnection({
    //     host:val.host,
    //     user:val.user,
    //     password:val.password,
    //     database:val.database
    // })
    var conn = mysql.createPool({
        connectionLimit: val.connectionLimit ? val.connectionLimit : 500,
        host: val.host,
        user: val.user,
        password: val.password, 
        database: val.database
    });

    conn.getConnection((err, cl)=>{
        if(err)throw err;
        cl.release()
      });

    return conn
}

//postgresql connection
let psql = (val)=>{

    const PG = require('pg-pool');

    if(!PG){
        console.log('sorry postgresql cannot be found\rplease make sure postgresql is installed in your system')
    }

    // let port = 5432
    // let ssl = false
    // let max = 100
    // let idleTimeoutMillis = 1000
    // let connectionTimeoutMillis = 10000
    // let maxUses = 7500

    // if(val.ssl){ssl = val.ssl}; if(val.max){max = val.max}; if(val.idleTimeoutMillis){connectionTimeoutMillis = val.idleTimeoutMillis};
    // if(val.connectionTimeoutMillis){connectionTimeoutMillis = val.connectionTimeoutMillis}; if(val.maxUses){maxUses = val.maxUses}

    const conn = new PG({
        user: val.user,
        host: val.host,
        password: val.password,
        port: val.port ? val.port : 5432,
        database: val.database,
        ssl: val.ssl ? val.ssl : false,
        max: val.max ? val.max : 100,
        idleTimeoutMillis: val.idleTimeoutMillis ? val.idleTimeoutMillis : 1000,
        connectionTimeoutMillis: val.connectionTimeoutMillis ? val.connectionTimeoutMillis : 10000,
        maxUses: val.maxUses ? val.maxUses : 7500
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
        console.log('sorry sqlite3 cannot be found\rplease make sure sqlite3 is installed in your system')
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
        mysql(values)
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