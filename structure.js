//structures, methods and functions

let {db_connection,app_name} = require(`${process.cwd()}/QT_FOLDER/settings.js`) //call the app_name and connection instance from setting

//function for querying the database (sqlite3)
var getQueryA = async(a,b,c)=>{
    return new Promise((resolve,reject) => {
        db_connection.connector.all(a,b,(err,rows) => {
           if(err){return reject(err);}
           //return one instance (first) if c === true else return all
           if(c){
             resolve(rows[0])
           } else {
             resolve(rows)
           }
         });
    });
}

//function for querying the database (psql and mysql)
var getQueryB = async(a,b,c)=>{
    return new Promise((resolve,reject) => {
        db_connection.connector.query(a,b,(err,res) => {
           if(err){return reject(err)}
           //return one instance (first) if c === true else return all
           if(c) {
                var ret = db_connection.db_name === 'mysql' ? res[0] : res.rows[0] //res.rows ? res.rows[0] : undefined
                resolve(ret)
           } else {
                var ret = db_connection.db_name === 'mysql' ? res : res.rows
                resolve(ret)
           }
         });
    });
}

//sql operators 
//con argument represent connectors
//the sign <{}> tells the function handling it that it is an operator
function Operators(){
    let beginsWith = (a,con) => {
        var c = ''
        if(con){ c = con }
        return `<{LIKE '${a}%'${c}}>`
    }
    //many to many insert when inserting values
    let m2mI = (values,key) => {
        return {m2m:true,values,key}
    }
    //many to many query
    let m2mQ = (values,/*contains*/) => {
        return {m2m:true,values/*,...contains*/}
    }

    let jsonQ = (values,/*contains*/) => {
        var main_value  = JSON.stringify(values)
        return {json:true,main_value/*,...contains*/}
    }

    let endsWith = (a,con) => {
        var c = ''
        if(con){ c = con }
        function wrapper(i,w_con){
            return `<{LIKE %${i}${w_con}}>`
        }
        return {wrapper,len:1,ops:true,params:[a],c}
    }

    let begins_and_endswith = (start='null',end='null',con) => {
        var c = ''
        if(con){ c = con }
        return `<{LIKE '${start}%${end}'${c}}>`
    }

    let notIn = (a,con) => {
        var c = ''
        if(con){ c = con }
        var put_in = ''
        a.map((itm)=>{
            var a;
            if(put_in == ''){
                a = `'${itm}'`
            } else {
                a = `,'${itm}'`
            }
          put_in += a
        })
        return `<{NOT IN (${put_in}${c})}>`
    }

    let isIn = (a,con) => {
        var c = ''
        if(con){ c = con }
        var put_in = ''
        a.map((itm)=>{
            var a;
            if(put_in == ''){
                a = `'${itm}'`
            } else {
                a = `,'${itm}'`
            }
          put_in += a
        })
        return `<{IN (${put_in}${c})}>`
    }

    let between = (start='null',end='null',con) => {
        var c = ''
        if(con){ c = con }
        
        function wrapper(i,j,w_con){
            var res = ''
            if( typeof(i) == 'number' && typeof(j) == 'number' ){
                res = `<{BETWEEN ${i} AND ${j}${w_con}}>`
            } else {
                res = `<{BETWEEN ${i} AND ${j}${w_con}}>`
            }
            return res
        }
        return {wrapper,len:2,ops:true,params:[start,end],c}
    }

    let notBetween = (start='null',end='null',con) => {
        var c = ''
        if(con){ c = con }
        function wrapper(i,j,w_con){
            var res = ''
            if( typeof(i) == 'number' && typeof(j) == 'number' ){
                res = `<{NOT BETWEEN ${i} AND ${j}${w_con}}>`
            } else {
                res = `<{NOT BETWEEN ${i} AND ${j}${w_con}}>`
            }
            return res
        }
        return {wrapper,len:2,ops:true,params:[start,end],c}
    }

    let contains = (a,con) => {
        var c = ''
        if(con){ c = con }
        return `<{LIKE '%${a}%'${c}}>`
    }

    let count = (a,comma=false) => {
        var res;
        if(comma){
            res = `COUNT(${a}),`
        } else {
            res = `COUNT(${a})`
        }
        return res
    }

    let avg = (a,comma=false) => {
        var res;
        if(comma){
            res = `AVG(${a}),`
        } else {
            res = `AVG(${a})`
        }
        return res
    }

    let sum = (a,comma=false) => {
        var res;
        if(comma){
            res = `SUM(${a}),`
        } else {
            res = `SUM(${a})`
        }
        return res
    }

    let max = (a,comma=false) => {
        var res;
        if(comma){
            res = `MAX(${a}),`
        } else {
            res = `MAX(${a})`
        }
        return res
    }

    let min = (a,comma=false) => {
        var res;
        if(comma){
            res = `MIN(${a}),`
        } else {
            res = `MIN(${a})`
        }
        return res
    }

    let gt = (a,con) => {
        var c = ''
        if(con){ c = con }
        function wrapper(i,w_con){
            return `<{> ${i}${w_con}}>`
        }
        return {wrapper,len:1,ops:true,params:[a],c}
    }

    let lt = (a,con) => {
        var c = ''
        if(con){ c = con }
        function wrapper(i,w_con){
            return `<{< ${i}${w_con}}>`
        }
        return {wrapper,len:1,ops:true,params:[a],c}
    }

    let gte = (a,con) => {
        var c = ''
        if(con){ c = con }
        function wrapper(i,w_con){
            return `<{>= ${i}${w_con}}>`
        }
        return {wrapper,len:1,ops:true,params:[a],c}
    }

    let lte = (a,con) => {
        var c = ''
        if(con){ c = con }
        function wrapper(i,w_con){
            return `<{<= ${i}${w_con}}>`
        }
        return {wrapper,len:1,ops:true,params:[a],c}
    }

    return {
        beginsWith,
        endsWith,
        begins_and_endswith, 
        notIn, 
        m2mI, 
        m2mQ, 
        isIn, 
        between, 
        notBetween, 
        contains, 
        jsonQ,
        count, 
        avg, 
        sum, 
        max, 
        min, 
        gt, 
        lt, 
        gte, 
        lte
    }
}

//quick table class
class QuickTable{

    constructor(table_name,db_instances,force=false){
        this.conn = db_connection.connector //connector
        this.db_name = db_connection.db_name //db_name
        this.app_name = app_name //app_name
        this.table_name = table_name //table_name
        this.table_fullname = `${app_name}_${table_name}` //table_fullname
        this.db_instances = db_instances //All the instances [column and its datatypes]
        this.force = force //tells the commands to drop and create table if set to true
        this.PK = [] //tells number of pk
        try{
            for(var i in this.db_instances){

                if(this.db_instances[i].primaryKey){
                    this.PK.push(i)
                }

                if(this.PK.length > 1){
                    throw 'PRIMARY KEY SHOULD BE IN ONE COLUMN ONLY\n YOU HAVE MORE THAN ONE COLUMN WITH PRIMARY KEY'
                }
            }
        }catch(err){
            console.error(err)
        }

    }

    //used to read to read none operators and convert them to the right command
    //eg converts {a:soli__,b:madx} to a=soli OR b=madx 
    parseVal(val,count,fin){
        let conOrRegExp = /[A-Za-z0-9\.\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+(\_{1})/igm //regExp to identify OR
        let conAndNotRegExp = /([A-Za-z0-9\.\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+)(\__{1})/igm //regExp to identify ANDNOT
        let conOrNotRegExp = /([A-Za-z0-9\.\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+)(\___{1})/igm //regExp to identify ORNot

        let checkOr = val.match(conOrRegExp)
        let checkAndNot = val.match(conAndNotRegExp)
        let checkOrNot = val.match(conOrNotRegExp)

        let result;

        let p_value =  this.db_name === 'sqlite3' ? '?'
        : this.db_name === 'mysql' ? '?'
        : this.db_name === 'psql' ? `$${count}`
        : null

        if(checkOr){
            let regOr = /\_/igm
            let m_val = val.replace(regOr,'')
            if(fin){
                result = [` = ${p_value}`,[m_val]]
            } else {
                result = [` = ${p_value} OR `, [m_val]]
            }
        }
        if(checkAndNot){
            let regNot = /\__/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = [` = ${p_value}`,[m_val]]
            } else {
                result = [` = ${p_value} AND NOT `, [m_val]]
            }
        }
        if(checkOrNot){
            let regNot = /\___/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = [` = ${p_value}`,[m_val]]
            } else {
                result = [` = ${p_value} OR NOT `,[m_val]]
            }
        }
        if(!checkOrNot && !checkOr && !checkAndNot){
            let m_val = val
            if(fin){
                result = [` = ${p_value}`,[m_val]]
            } else {
                result = [` = ${p_value} AND `,[m_val]]
            }
        }
        return result
    }
    //for converting operators to what can be manipulated by funcVal
    parseFunc(func){
        let RegExp = /\<\{[A-Za-z0-9\.\(\)\'\<\>\=\'\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+\}\>/igm
        let check = func.match(RegExp)

        let result;

        if(check){
            let step1 = /\<\{/igm
            let step2 = /\}\>/igm
            let init_val = func.replace(step1,'')
            result = init_val.replace(step2,'')
        }
        return result
    }

    //used to read to read func and convert them to the right command
    //eg converts {a:soli__,b:madx} to a=soli OR b=madx 
    parseFuncVal(val,count,param,fin){
        let conOrRegExp = /[A-Za-z0-9\.\:\;\(\)\#\$\%\^\&\*\_\-\@\?\/\,\<\>\=\'\'\s]+(\_{1})/igm
        let conAndNotRegExp = /([A-Za-z0-9\.\:\(\)\;\#\$\%\^\&\*\_\-\@\?\/\,\<\>\=\'\'\s]+)(\__{1})/igm
        let conOrNotRegExp = /([A-Za-z0-9\.\:\;\(\)\#\$\%\^\&\*\_\-\@\?\/\,\<\>\=\'\'\s]+)(\___{1})/igm

        let checkOr = val.match(conOrRegExp)
        let checkAndNot = val.match(conAndNotRegExp)
        let checkOrNot = val.match(conOrNotRegExp)

        let result;

        // let p_value =  this.db_name === 'sqlite3' ? '?'
        // : this.db_name === 'mysql' ? '?'
        // : this.db_name === 'psql' ? `$${count}`
        // : null

        let parameter = param.params ? param.params : [false]

        if(checkOr){
            let regOr = /\_/igm
            let m_val = val.replace(regOr,'')
            if(fin){
                result = [` ${m_val}`,parameter]
            } else {
                result = [` ${m_val} OR `,parameter]
            }
        }
        if(checkAndNot){
            let regNot = /\__/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = [` ${m_val}`,parameter]
            } else {
                result = [` ${m_val} AND NOT `,parameter]
            }
        }
        if(checkOrNot){
            let regNot = /\___/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = [` ${m_val}`,parameter]
            } else {
                result = [` ${m_val} OR NOT `,parameter]
            }
        }
        if(!checkOrNot && !checkOr && !checkAndNot){
            let m_val = val
            if(fin){
                result = [` ${m_val}`,parameter]
            } else {
                result =[` ${m_val} AND `,parameter]
            }
        }
        return result
    }

    //calls both val,func and funcval to perform its function
    parseAll(val,count,fin){
        let RegExp = /\<\{[A-Za-z0-9\.\(\)\'\<\>\=\'\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+\}\>/igm
        let result;
        val = typeof val !== 'string' && !(val.ops) ? val.toString() : val

        let p_value =  this.db_name === 'sqlite3' ? '?'
        : this.db_name === 'mysql' ? '?'
        : this.db_name === 'psql' ? `$${count}`
        : null

        var check_val = val
        
        if(val.len == 1){
            let p_value =  this.db_name === 'sqlite3' ? '?'
            : this.db_name === 'mysql' ? '?'
            : this.db_name === 'psql' ? `$${count}`
            : null

            var {c} = val

            check_val =  val.wrapper(p_value,c)
        } else if( val.len == 2 ){
            let p_value_1 =  this.db_name === 'sqlite3' ? '?'
            : this.db_name === 'mysql' ? '?'
            : this.db_name === 'psql' ? `$${count}`
            : null

            let p_value_2 =  this.db_name === 'sqlite3' ? '?'
            : this.db_name === 'mysql' ? '?'
            : this.db_name === 'psql' ? `$${count+1}`
            : null

            var {c} = val

            check_val =  val.wrapper( p_value_1,p_value_2,c )
        }

        if (val !== true && val !== false){
            let check = check_val.match(RegExp);
            if(check){
                let first_step = this.parseFunc(check_val)
                if(fin){
                    result = this.parseFuncVal(first_step,count,val,fin)
                } else {
                    result = this.parseFuncVal(first_step,count,val)
                }
            } else {
                if(fin){
                    result = this.parseVal(val,count,fin)
                } else {
                    result = this.parseVal(val,count)
                }
            }
        } else {
            if( val === true ){
                result = [` = ${p_value}`,true]
            } else if( val === false ){
                result = [` = ${p_value}`,false]
            }
        }
        return result
    }

    //know table for many to many
    knowTable(n){
        var columns__ = this.db_instances
        var output = columns__[n].motherTable

        return {table:`${this.table_fullname}__${this.app_name}_${output}`,motherTable:`${this.app_name}_${output}`}
    }

    createM2MTable(motherTable,m2mTable,a){
        //check if mother exist
        var int = this.db_name == 'sqlite3' ? 'INTEGER' : 'Int' //switching integer value based on the sql being used
        //create many to many table if not exist
        var create_table = `CREATE TABLE IF NOT EXISTS ${m2mTable}(
            id_main_table ${int} NOT NULL,
            id_referenced_table ${int} NOT NULL,
            deleted Boolean DEFAULT false,
            CONSTRAINT FK_${a}__${motherTable} FOREIGN KEY (id_main_table) REFERENCES ${a}(id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT FK_${motherTable}__${a} FOREIGN KEY (id_referenced_table) REFERENCES ${motherTable}(id)
            ON DELETE CASCADE ON UPDATE CASCADE
         )`
         //console.log(create_table)

        if(this.db_name === 'sqlite3'){
            this.conn.run(create_table,(err)=>{
                if(err) throw err
            })
        }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
            this.conn.query(create_table,(err)=>{
                if(err) throw err
            })
        }
    }
    //create tables
    create(a){
        var output = (async()=>{
            var tableFullname;
            var instances;
            a && a.table ? tableFullname = a.table : tableFullname = this.table_fullname
            a && a.instances ? instances = a.instances : instances = this.db_instances
            let autoIncrease;
            let int;
            let queryIt;
            this.db_name === 'sqlite3' ? autoIncrease = `UNIQUE` 
            : this.db_name === 'psql' ? autoIncrease = `SERIAL UNIQUE` 
            : autoIncrease = `AUTO_INCREMENT UNIQUE`

            this.db_name === 'sqlite3' ? int = `INTEGER` : int = `Int`
            this.db_name === 'psql' ? queryIt = `id ${autoIncrease}` : queryIt = `id ${int} ${autoIncrease}`
            var statement = `CREATE TABLE IF NOT EXISTS ${tableFullname}(${queryIt}`

            //drop table before creating if force === true
            if(this.force){
                this.drop()
                statement = `CREATE TABLE ${tableFullname}(${queryIt}`
            }

            let m2mList = [] //List containing all many to many instances
            let constraints = ''
            let PKEYS = this.db_name !== 'sqlite3' ? `CONSTRAINT PK_${tableFullname}__id PRIMARY KEY(id)` : 'id'

            //Iterate over instances and manipulate on each to get the main value 
            //converting them to sql command
            for(var f in instances){
                //If instance contains a many to many run the below command
                if(instances[f].motherTable){
                    //map out many to many tables
                    var m2mTable = `${tableFullname}__${this.app_name}_${instances[f].motherTable}`
                    m2mList.push([`${this.app_name}_${instances[f].motherTable}`,m2mTable])
                }
                let __r__ = `, ${f.toString()} ${instances[f].value.toString()}`;
                statement += __r__

                //If instance contains a primaryKey run the below command
                if ( instances[f].primaryKey ){
                    if(this.db_name == 'sqlite3'){
                        PKEYS = `${f}`
                    } else {
                        PKEYS = `CONSTRAINT PK_${tableFullname}__${f} PRIMARY KEY(${f})`
                    }
                }

                //If instance contains a ForeignKey run the below command
                if ( instances[f].referencedTable ){
                    var {referencedTable} = instances[f]
                    constraints += `, CONSTRAINT FK_${tableFullname}__${f} FOREIGN KEY (${f}) REFERENCES ${this.app_name}_${referencedTable}(id) ON DELETE CASCADE ON UPDATE CASCADE`
                }
            }

            if(this.db_name !== 'sqlite3') {
                constraints+=`, ${PKEYS}`;
            } else {
                constraints+=`, PRIMARY KEY(${PKEYS})`;
            }
            statement+=`${constraints})`

            //console.log(statement)

            if(this.db_name === 'sqlite3'){
                this.conn.run(statement,(err)=>{
                    if(err) throw err
                    m2mList.map(itm=>this.createM2MTable(itm[0],itm[1],tableFullname))
                })
            }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){ 
                this.conn.query(statement,(err)=>{
                    if(err) throw err
                    m2mList.map(itm=>this.createM2MTable(itm[0],itm[1],tableFullname))
                    // console.log('TABLE CREATED')
                })
            }
            return tableFullname
        })()
        return output
    }

    //drops table if deleted from its structure's module
    drop(arg){
        var droppingTable = []

        var instances;
        var mainTable;
        var cascade = ''
        arg && arg.instances? instances = arg.instances : instances = this.db_instances
        arg && arg.table? mainTable = arg.table : mainTable = this.table_fullname

        for(var n in instances){
            if(instances[n].motherTable){
                let {table} = this.knowTable(n)
                droppingTable.push(table)
            }
        }

        droppingTable.push(`${mainTable}`)
        this.db_name !== 'sqlite3' ? cascade = `CASCADE` : null ;
        droppingTable.map(a=>{
            var q =`DROP TABLE IF EXISTS ${a} ${cascade}`
            if(this.db_name === 'sqlite3'){
                this.conn.run(q,(err)=>{
                    if(err) throw err;
                    //console.log(`${a} dropped`)
                })
            }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                this.conn.query(q,(err)=>{
                    if(err) throw err
                    //console.log(`${a} dropped`)
                })
            }
        })
    }

    //insert values into many to many column
    insertM2MTable(Q){
        //console.log(Q)
        for(var n in Q){
            //iterate over the values in m2m and insert them
            Q[n].values.map((itm)=>{
                let id = Q[n].key
                let {table} = this.knowTable(n)
                let {motherTable} = this.knowTable(n)
                var q_mysql = `INSERT INTO ${table}(id_main_table,id_referenced_table) VALUES (?,?)`
                var q_psql = `INSERT INTO ${table}(id_main_table,id_referenced_table) VALUES ($1,$2)`
                var q_sqlite3 = `INSERT INTO ${table}(id_main_table,id_referenced_table) VALUES (?,?)`

                var qq_mysql = `SELECT * FROM ${table} WHERE id_main_table = ? AND id_referenced_table = ?`
                var qq_psql  = `SELECT * FROM ${table} WHERE id_main_table = $1 AND id_referenced_table = $2`
                var qq_sqlite3 = `SELECT * FROM ${table} WHERE id_main_table = ? AND id_referenced_table = ?`
                //console.log(q)
                var parameter = [id,itm]

                if(this.db_name === 'sqlite3'){
                    (async()=>{
                        let QueryReturn = await getQueryA(qq_sqlite3,parameter,true) //check if value already exist in m2m column
                        
                        //if undefined insert the value
                        if (QueryReturn === undefined ) {
                            this.conn.run(q_sqlite3,(err)=>{
                                if(err) throw `cannot not be inserted into '${n}' column because the mother table ${motherTable} or the main table ${this.table_fullname} with such id does not exist`//err
                            })
                        }
                    })()
                } else if(this.db_name === 'psql' ||  this.db_name === 'mysql') {
                   (async()=>{
                        var main_qq = this.db_name == 'psql' ? qq_psql : qq_mysql
                        let QueryReturn = await getQueryB(main_qq,parameter,true) //check if value already exist in m2m column
                        var main_q = this.db_name == 'psql' ? q_psql : q_mysql

                        //if undefined insert the value
                        if (QueryReturn === undefined ) {
                            this.conn.query(main_q,(err)=>{
                                if(err) throw `cannot not be inserted into '${n}' column because the mother table ${motherTable} or the main table ${this.table_fullname} with such id does not exist`//err
                            })
                        }
                    })()
                }
            })
        }
    }

    //Insert values into the DB
    insert( _values,now=false){
        let statement;
        let _i_i_ = 0
        let _i_counter__ = parseInt(Object.keys(_values).length-1)

        let __columns__ = `INSERT INTO ${this.table_fullname}(`
        let __values__ = '('
        var parameter = []
        let _v_length = Object.keys(_values).length
        let psql_i = 1
        let m2mList = []

        for(var f in _values){
            if(_values[f].m2m){//check for m2m
                    let insert_values = {}
                    insert_values[f] = _values[f]
                    m2mList.push(insert_values)
            } else if(this.db_instances[f] && this.db_instances[f].JSON){ //check for json
                __columns__+= `${f}`;
                var stringValue = JSON.stringify(_values[f])
                parameter.push(stringValue)

                if(_i_i_ < _i_counter__){

                    __values__+= this.db_name === 'sqlite3' ? '?,'
                    : this.db_name === 'mysql' ? '?,'
                    : this.db_name === 'psql' ? `$${psql_i},`
                    : null

                }else{

                    __values__+= this.db_name === 'sqlite3' ? '?'
                    : this.db_name === 'mysql' ? '?'
                    : this.db_name === 'psql' ? `$${psql_i}`
                    : null

                }

            } else {
                if(_v_length == 1){
                    __columns__+= `${f}`;
                    parameter.push(_values[f])
                    
                    __values__+= this.db_name === 'sqlite3' ? '?'
                    : this.db_name === 'mysql' ? '?'
                    : this.db_name === 'psql' ? `$${psql_i}`
                    : null
                }else{
                    if(_i_i_ < _i_counter__){
                        __columns__+= `${f},`;
                        parameter.push(_values[f]);

                        __values__+= this.db_name === 'sqlite3' ? '?,'
                        : this.db_name === 'mysql' ? '?,'
                        : this.db_name === 'psql' ? `$${psql_i},`
                        : null

                    }else{
                        __columns__+=`${f}`;
                        parameter.push(_values[f]);

                        __values__+= this.db_name === 'sqlite3' ? '?'
                        : this.db_name === 'mysql' ? '?'
                        : this.db_name === 'psql' ? `$${psql_i}`
                        : null
                    }
                }
            }
             _i_i_++
             psql_i++
        }

        for(var i in this.db_instances){
            var y = parameter.length+1
            if(this.db_instances[i].dataType === ('Date'||'SmallDateTime'||'DateTime'||'Time') && this.db_instances[i].AutoUpdate){
                __columns__+=`${i}`
                parameter.push(this.db_instances[i].AutoFunc())

                __values__+= this.db_name === 'sqlite3' ? ',?'
                : this.db_name === 'mysql' ? ',?'
                : this.db_name === 'psql' ? `,$${y}`
                : null
                y++
            }
        }
        __columns__+=')'
        __values__+=')'
        statement = `${__columns__} VALUES ${__values__}`
        // console.log(statement)
        //console.log(m2mList)

        if(now){
            if(this.db_name === 'sqlite3'){
                this.conn.run(statement,parameter,(err)=>{
                    if(err) throw err
                    m2mList.map(i=>this.insertM2MTable(i)) //console.log(`values inserted into table ${this.table_fullname}`)
                })
            }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                this.conn.query(statement,parameter,(err)=>{
                    if(err) throw err
                    m2mList.map(i=>this.insertM2MTable(i))
                })
            }
        }

        return {statement,parameter,m2mList,now,insert:true}
    }

    //updates a particular row in the DB
    updateRows( __values_ ) {
        var q = `UPDATE ${this.table_fullname} SET`
        var count = 0
        var psql_i = 1
        var params = []
        for(var i in __values_){
            var paramValue = this.db_name === 'sqlite3' || this.db_name === 'mysql' ? '?' : this.db_name === 'psql' ? `$${psql_i}` : null
            var add = ` ${i} = ${paramValue}`
            if(this.db_instances[i] && this.db_instances[i].JSON){
                params.push(JSON.stringify(__values_[i])) 
            } else if( this.db_instances[i] && this.db_instances[i].m2m ){ 
                params.push(JSON.stringify(__values_[i])) 
            } else {
                params.push(__values_[i])
            }
            
            if(  count < Object.keys(__values_).length - 1 ){
                //console.log(i)
                add+=','
            }
            q+=add
            count++
            psql_i++
        }
        q+= ` WHERE id = ${__values_.id}` //Add the update to a particular row
        
        // console.log(q)

        if(this.db_name === 'sqlite3'){
            this.conn.run(q,params,(err)=>{
                if(err) throw err
            })
        }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
            this.conn.query(q,params,(err)=>{
                if(err) throw err
            })
        }
    }

    //Get a single row from a table 
    //Otherquery indicates how to handle m2mKeys,Order,Val,Order,and JSONKeys
    find(query,otherQuery) {
        if(!otherQuery) otherQuery = {};
        var val = null; if(otherQuery.val) val = otherQuery.val;
        var order=null; if(otherQuery.order) order = otherQuery.order;
        var group=null; if(otherQuery.group) group = otherQuery.group;
        var distinct=false; if(otherQuery){if(otherQuery.distinct) distinct = otherQuery.distinct;};
        let output = (async()=> {
            let columns_ = `*`
            let order_ = ``
            let group_ = ``
            if(val){ columns_ = val }
            if(order){
                var direction;
                var regExp = /\>/igm;
                direction = order.match(regExp)
                if(!direction){
                    var regExp2 = /\</igm;
                    var value = order.replace(regExp2,'');
                    order_ = ` ORDER BY ${value} ASC`
                } else {
                    var value = order.replace(regExp,'');
                    order_ = ` ORDER BY ${value} DESC`
                }
            }

            if(group){
                group_ = ` GROUP BY ${group}`
            }

            let select;
            if(distinct){ select = `SELECT DISTINCT` } else { select = `SELECT` }
            let q = `${select} ${columns_} FROM ${this.table_fullname} `
            let where_clause = '';
            let _index = Object.keys(query).length
            let __counter_ = _index - 1
            let z = 0
            let m2mList = [] //List of m2m query if there is m2m query
            let psql_i = 1
            let parameter = []
            for(var i in query){
                if(query[i].m2m){
                    let insert_values = {}
                    insert_values[i] = query[i]
                    m2mList.push(insert_values)
                } else {
                    if(query[i].json){ //check for json
                    //still working here
                        let __add__ ;                    
                        if(z < __counter_){
                            var count__ = this.db_name === 'psql' ? psql_i : null
                            var stringValue = query[i].main_value
                            var output__ = this.parseAll(stringValue, count__)
                            __add__ = `${i}${output__[0]}`
                            output__[1].map(i=>{
                                if( i !== false ){
                                    parameter.push(i)
                                }
                            })

                        }else{
                                var count__ = this.db_name === 'psql' ? psql_i : null
                                var stringValue = query[i].main_value
                                var output__ = this.parseAll(stringValue,count__, 'final')
                                __add__ = `${i}${output__[0]}`
                                output__[1].map(i=>{
                                    if( i !== false ){
                                        parameter.push(i)
                                    }
                                })
                        }
                        
                        //if( query[i].ops && query[i].len > 1 ) psql_i++ ;

                        where_clause+=__add__
                    
                    } else if(_index == 1){
                        let __add__;
                        if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                            __add__ = `${i} IS NULL`
                        } else {
                            var count__ = this.db_name === 'psql' ? psql_i : null
                            var output__ = this.parseAll(query[i], count__, 'final')
                            __add__ = `${i}${output__[0]}`
                            output__[1].map(i=>{
                                if( i !== false ){
                                    parameter.push(i)
                                }
                            })
                        }
                        where_clause+= __add__
                    } else {
                        let __add__;
                        if(z < __counter_){
                            if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                                var connector = query[i] == '_' ? 'OR' 
                                : query[i] == '__' ? 'AND NOT' 
                                : query[i] == '___' ? 'OR NOT' 
                                : 'AND'

                                __add__ = `${i} IS NULL ${connector}`
                            } else {
                                var count__ = this.db_name === 'psql' ? psql_i : null
                                var output__ = this.parseAll(query[i],count__)
                                __add__ = `${i}${output__[0]}`
                                // console.log(output__)
                                output__[1].map(i=>{
                                    if( i !== false ){
                                        parameter.push(i)
                                    }
                                })
                            }
                            where_clause+= __add__
                        } else {
                            if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                                __add__ = `${i} IS NULL`
                            } else {
                                var count__ = this.db_name === 'psql' ? psql_i : null
                                var output__ = this.parseAll(query[i], count__,'final')
                                __add__ = `${i}${output__[0]}`
                                output__[1].map(i=>{
                                    if( i !== false ){
                                        parameter.push(i)
                                    }
                                })
                            }
                            where_clause+= __add__
                        }
                    }
                    if( query[i].ops && query[i].len > 1 ) {
                         psql_i+=2 
                    } else {
                        psql_i++
                    }
                }
                z++
            }
            if(where_clause) q+= `WHERE ${where_clause} `;
            q+=group_
            q+=order_
            // console.log(q,parameter)
            let response;
            try{
                this.db_name == 'sqlite3' ? response = await getQueryA(q,parameter,true) : response = await getQueryB(q,parameter,true) //query the DB
            } catch(e) {
                console.error(`An error occurred:${e}`)
            }
            if(response !== undefined){
                var instances  = this.db_instances

                for(var n in instances){
                    if(instances[n].motherTable ){
                        response[n] = JSON.parse(response[n])
                    } else if(instances[n].JSON){
                        response[n] = JSON.parse(response[n])
                    }
                }

                //check if m2mList is not empty and if not empty 
                //query from the DB and add to response
                if (m2mList.length !== 0) {
                    var m2mSearch = '';
                    for(var i=0; i<m2mList.length; i++){
                        for(var n in m2mList[i]){
                            var m2mCount = 1, m2mParam = []
                            m2mList[i][n].values.map((k,l)=>{
                                if( i === m2mList.length-1 && l === m2mList[i][n].values.length-1 ){
                                    m2mSearch+=this.db_name === 'sqlite3' ? 'id_referenced_table = ?'
                                    : this.db_name === 'mysql' ? 'id_referenced_table = ?'
                                    : this.db_name === 'psql' ? `id_referenced_table = $${m2mCount}`
                                    : null
                                    m2mParam.push(k)
                                } else {
                                    m2mSearch+=this.db_name === 'sqlite3' ? 'id_referenced_table = ? OR'
                                    : this.db_name === 'mysql' ? 'id_referenced_table = ? OR'
                                    : this.db_name === 'psql' ? `id_referenced_table = $${m2mCount} OR`
                                    : null
                                    m2mParam.push(k)
                                }
                                m2mCount++
                            })
                            m2mSearch+=` AND deleted = false`
                            let {table} = this.knowTable(n)
                            var Qq = `SELECT id_main_table, id_referenced_table FROM ${table} WHERE ${m2mSearch}`
                            var m2mQueryReturn;
                            this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq,m2mParam) : m2mQueryReturn = await getQueryB(Qq,m2mParam) //query DB
                            //push only id if the val of m2m is not given
                            if(otherQuery.m2mValue === undefined || otherQuery.m2mValue[n] === undefined ){
                                m2mQueryReturn.map(itm=>{
                                    if( response.id === itm.id_main_table ) {
                                        response[n].push(itm.id_referenced_table)

                                    }
                                })
                            }else{ //Get the given value for m2m before pushing
                                var {motherTable} = this.knowTable(n)
                                for(var k=0;k<m2mQueryReturn.length;k++){
                                    if( response.id === m2mQueryReturn[k].id_main_table ) {
                                        var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                        var returnedQuery;
                                        this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,[],true) : returnedQuery = await getQueryB(qq,[],true)
                                        response[n].push(returnedQuery)
                                    }
                                }
                            }
                        }
                    }

                    //***
                    m2mList.map((i,j)=>{
                        for(var n in i){
                            if(response[n].length === 0 && !(i[n].containAll)){
                                response = null
                            } else if (i[n].containAll && response[n].length < i[n].values.length) {
                                response = null
                            }
                        }
                    })
                } else { //if m2mList is empty check if there is a m2m column and handle it
                    var instances  = this.db_instances

                    for(var n in instances){
                        if(instances[n].motherTable){
                            let {table} = this.knowTable(n)
                            var Qq = `SELECT id_main_table, id_referenced_table FROM ${table}`
                            var m2mQueryReturn;
                            this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq,[]) : m2mQueryReturn = await getQueryB(Qq,[])
                            if(otherQuery.m2mValue === undefined || otherQuery.m2mValue[n] === undefined ){
                                m2mQueryReturn.map(items=>{
                                    if( response.id === items.id_main_table ) {
                                        response[n].push(items.id_referenced_table)

                                    }
                                })
                            } else {
                                var {motherTable} = this.knowTable(n)
                                for(var k=0;k<m2mQueryReturn.length;k++){
                                    if( response.id === m2mQueryReturn[k].id_main_table ) {
                                        var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                        //console.log(qq)
                                        var returnedQuery;
                                        this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,[],true) : returnedQuery = await getQueryB(qq,[],true)
                                        response[n].push(returnedQuery)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if(response === undefined) response=null;

            return response
        })()
        return output
    }


    //save to db manually
    save(query){
        if(query.insert && !(query.now)){
            if(this.db_name === 'sqlite3'){
                this.conn.run(query.statement,query.parameter,(err)=>{
                    if(err) throw err
                    query.m2mList.map(i=>this.insertM2MTable(i)) //console.log(`values inserted into table ${this.table_fullname}`)
                })
            }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                this.conn.query(query.statement,query.parameter,(err)=>{
                    if(err) throw err
                    query.m2mList.map(i=>this.insertM2MTable(i))
                })
            }
        } else {
            this.updateRows(query)
        }
    }

    //Get all from db 
    //Otherquery indicates how to handle m2mKeys,Order,Val,Order,and JSONKeys
    extract(query,otherQuery) {
        if(!otherQuery) otherQuery = {};
        var val = null; if(otherQuery.val) val = otherQuery.val;
        var order=null; if(otherQuery.order) order = otherQuery.order;
        var group=null; if(otherQuery.group) group = otherQuery.group;
        var distinct=false; if(otherQuery){if(otherQuery.distinct) distinct = otherQuery.distinct;};
        var q;
        let parameter = [];
        var m2mList = [] //List of m2m query if there is m2m query
        let output = (async()=>{
            if(otherQuery.statementGiven){
                q = query
            } else {
                let columns_ = `*`
                let order_ = ``
                let group_ = ``
                if(val){ columns_ = val }
                if(order){
                    var direction;
                    var regExp = /\>/igm;
                    direction = order.match(regExp)
                    if(!direction){
                        var regExp2 = /\</igm;
                        var value = order.replace(regExp2,'');
                        order_ = ` ORDER BY ${value} ASC`
                    } else {
                        var value = order.replace(regExp,'');
                        order_ = ` ORDER BY ${value} DESC`
                    }
                }

                if(group){
                    group_ = ` GROUP BY ${group}`
                }

                let select;
                if(distinct){ select = `SELECT DISTINCT` } else { select = `SELECT` }
                q = `${select} ${columns_} FROM ${this.table_fullname} `
                let where_clause = ''
                let _index = Object.keys(query).length
                let __counter_ = _index - 1
                let z = 0
                let psql_i = 1
                var __ = Operators()
                for(var i in query){

                    if(query[i].m2m){
                        let insert_values = {}
                        insert_values[i] = query[i]
                        m2mList.push(insert_values)
                    } else {
                        if(query[i].json){ //check for json
                            let __add__ ;
                            if(z < __counter_){
                                var count__ = this.db_name === 'psql' ? psql_i : null
                                var stringValue = query[i].main_value
                                var output__ = this.parseAll(stringValue, count__)
                                __add__ = `${i}${output__[0]}`
                                output__[1].map(i=>{
                                    if( i !== false ){
                                        parameter.push(i)
                                    }
                                })
        
                            }else{
                                var count__ = this.db_name === 'psql' ? psql_i : null
                                var stringValue = query[i].main_value
                                var output__ = this.parseAll(stringValue,count__, 'final')
                                __add__ = `${i}${output__[0]}`
                                output__[1].map(i=>{
                                    if( i !== false ){
                                        parameter.push(i)
                                    }
                                })
                            } 
                            
                            where_clause+= __add__
                        } else {
                            if(_index == 1){
                                let __add__;
                                if(Array.isArray(query[i])){
                                    var parseArg = __.isIn(query[i][0],query[i][1])
                                    var count__ = this.db_name === 'psql' ? psql_i : null
                                    var output__ = this.parseAll(parseArg, count__, 'final')
                                    __add__ = `${i}${output__[0]}`
                                    output__[1].map(i=>{
                                        if( i !== false ){
                                            parameter.push(i)
                                        }
                                    })
                                } else {
                                    if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                                        __add__ = `${i} IS NULL`
                                    } else {
                                        var count__ = this.db_name === 'psql' ? psql_i : null
                                        var output__ = this.parseAll(query[i], count__, 'final')
                                        __add__ = `${i}${output__[0]}`
                                        output__[1].map(i=>{
                                            if( i !== false ){
                                                parameter.push(i)
                                            }
                                        })
                                    }
                                }
                                where_clause+= __add__
                            } else {
                                let __add__;
                                if(z < __counter_){
                                    if(Array.isArray(query[i])){
                                        var parseArg = __.isIn(query[i][0],query[i][1])
                                        var count__ = this.db_name === 'psql' ? psql_i : null
                                        var output__ = this.parseAll(parseArg, count__)
                                        __add__ = `${i}${output__[0]}`
                                        output__[1].map(i=>{
                                            if( i !== false ){
                                                parameter.push(i)
                                            }
                                        })
                                    } else {
                                        if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                                            var connector = query[i] == '_' ? 'OR' 
                                            : query[i] == '__' ? 'AND NOT' 
                                            : query[i] == '___' ? 'OR NOT' 
                                            : 'AND'
                                            __add__ = `${i} IS NULL ${connector}`
                                        } else {
                                            var count__ = this.db_name === 'psql' ? psql_i : null
                                            var output__ = this.parseAll(query[i], count__)
                                            __add__ = `${i}${output__[0]}`
                                            output__[1].map(i=>{
                                                if( i !== false ){
                                                    parameter.push(i)
                                                }
                                            })
                                        }
                                    }
                                    where_clause+= __add__
                                } else {
                                    if(Array.isArray(query[i])){
                                        var parseArg = __.isIn(query[i][0],query[i][1])
                                        var count__ = this.db_name === 'psql' ? psql_i : null
                                        var output__ = this.parseAll(parseArg, count__, 'final')
                                        __add__ = `${i}${output__[0]}`
                                        output__[1].map(i=>{
                                            if( i !== false ){
                                                parameter.push(i)
                                            }
                                        })

                                    } else {
                                        if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___' && query[i] !== false){
                                            __add__ = `${i} IS NULL`
                                        } else {
                                            var count__ = this.db_name === 'psql' ? psql_i : null
                                            var output__ = this.parseAll(query[i], count__, 'final')
                                            __add__ = `${i}${output__[0]}`
                                            output__[1].map(i=>{
                                                if( i !== false ){
                                                    parameter.push(i)
                                                }
                                            })
                                        }
                                    }
                                    where_clause+= __add__
                                }
                            }
                        }
                        if( query[i].ops && query[i].len > 1 ) {
                            psql_i+=2 
                        } else {
                            psql_i++ 
                        }
                    }
                    z++
                }
                if(where_clause) q+=`WHERE ${where_clause} `;
                q+=group_
                q+=order_
                // console.log(q)
            }
            let response;
            let itemToRemove = []
            try{
                this.db_name == 'sqlite3' ? response = await getQueryA(q,parameter) : response = await getQueryB(q,parameter) //query the DB
            } catch(e) {
                console.error(`An error occurred:${e}`)
            }

            //handling many to many field in other to output the right result
            if(response !== undefined){
                var instances  = this.db_instances

                for(var n in instances){
                    if(instances[n].motherTable || instances[n].JSON){
                        response.map(itm=>{
                            itm[n] = JSON.parse(itm[n])
                        })
                    }
                }

                //check if m2mList is not empty and if not empty 
                //query from the DB and add to response
                if(m2mList.length !== 0){
                    var m2mSearch = '';
                    for(var i=0; i<m2mList.length; i++){
                        for(var n in m2mList[i]){
                            var m2mCount = 1, m2mParam = [];
                            m2mList[i][n].values.map((k,l)=>{
                                if( i === m2mList.length-1 && l === m2mList[i][n].values.length-1 ){
                                    m2mSearch+=this.db_name === 'sqlite3' ? 'id_referenced_table = ?'
                                    : this.db_name === 'mysql' ? 'id_referenced_table = ?'
                                    : this.db_name === 'psql' ? `id_referenced_table = $${m2mCount}`
                                    : null
                                    m2mParam.push(k)
                                } else {
                                    m2mSearch+=this.db_name === 'sqlite3' ? 'id_referenced_table = ? OR'
                                    : this.db_name === 'mysql' ? 'id_referenced_table = ? OR'
                                    : this.db_name === 'psql' ? `id_referenced_table = $${m2mCount} OR`
                                    : null
                                    m2mParam.push(k)
                                }
                            })
                            m2mSearch+=` AND deleted = false`
                            let {table} = this.knowTable(n)
                            var Qq = `SELECT id_main_table, id_referenced_table FROM ${table} WHERE ${m2mSearch}`
                            var m2mQueryReturn;
                            this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq,m2mParam) : m2mQueryReturn = await getQueryB(Qq,m2mParam) //Query DB
                            //if otherQuery is not given send id to the response
                            if(otherQuery.m2mValue === undefined || otherQuery.m2mValue[n] === undefined ){
                                response.map(itm=>{
                                    m2mQueryReturn.map(items=>{
                                        if( itm.id === items.id_main_table ) {
                                            itm[n].push(items.id_referenced_table)

                                        }
                                    })
                                })
                            }else{ //else if the value is given send the value to response
                                var {motherTable} = this.knowTable(n)
                                for(var m=0;m<response.length;m++){
                                    for(var k=0;k<m2mQueryReturn.length;k++){
                                        if( response[m].id === m2mQueryReturn[k].id_main_table ) {
                                            var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                            var returnedQuery;
                                            this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,[],true) : returnedQuery = await getQueryB(qq,[],true)
                                            response[m][n].push(returnedQuery)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    m2mList.map((i,j)=>{
                        for(var n in i){
                            response.map((itm)=>{
                                if(itm[n].length === 0 && !(i[n].containAll)){
                                    itemToRemove.push(itm)
                                } else if (i[n].containAll && itm[n].length < i[n].values.length) {
                                    itemToRemove.push(itm)
                                }
                            })
                        }
                    })
                } else {//if m2mList is empty check if there is a m2m column and handle it
                    var instances  = this.db_instances

                    for(var n in instances){
                        if(instances[n].motherTable){
                            let {table} = this.knowTable(n)
                            var Qq = `SELECT id_main_table, id_referenced_table FROM ${table}`
                            var m2mQueryReturn;
                            this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq,[]) : m2mQueryReturn = await getQueryB(Qq,[])

                            //if !otherQuery
                            if(otherQuery.m2mValue === undefined || otherQuery.m2mValue[n] === undefined ){
                                    response.map(itm=>{
                                        m2mQueryReturn.map(items=>{
                                            if( itm.id === items.id_main_table ) {
                                                itm[n].push(items.id_referenced_table)

                                            }
                                        })
                                    })
                            } else {
                                var {motherTable} = this.knowTable(n)

                                for(var m=0;m<response.length;m++){
                                    for(var k=0;k<m2mQueryReturn.length;k++){
                                        if( response[m].id === m2mQueryReturn[k].id_main_table ) {
                                            var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                            //console.log(qq)
                                            var returnedQuery;
                                            this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,[],true) : returnedQuery = await getQueryB(qq,[],true)
                                            response[m][n].push(returnedQuery)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            itemToRemove.map(itm=>{
                response.splice(response.indexOf(itm),1)
            })

            return response
        })()
        return output
    }

    //pull all from the database
    all(otherQuery) {
        if(!otherQuery) otherQuery = {};
        var val = null; if(otherQuery.val) val = otherQuery.val;
        var order=null; if(otherQuery.order) order = otherQuery.order;
        var group=null; if(otherQuery.group) group = otherQuery.group;
        var distinct=false; if(otherQuery){if(otherQuery.distinct) distinct = otherQuery.distinct;};
        let output = (async()=>{
            let order_ = ``
            let group_ = ``
            let columns_ = `*`
            if(val){ columns_ = val }
            if(order){
                var direction;
                var regExp = /\>/igm;
                direction = order.match(regExp)
                if(!direction){
                    var regExp2 = /\</igm;
                    var value = order.replace(regExp2,'');
                    order_ = ` ORDER BY ${value} ASC`
                } else {
                    var value = order.replace(regExp,'');
                    order_ = ` ORDER BY ${value} DESC`
                }
            }

            if(group){
                group_ = ` GROUP BY ${group} `
            }
            let select;
            if(distinct){ select = `SELECT DISTINCT` } else { select = `SELECT` }
            let a = `${select} ${columns_} FROM ${this.table_fullname}`
            a+=group_
            a+=order_
            let response;
            try{
                this.db_name == 'sqlite3' ? response = await getQueryA(a,[]) : response = await getQueryB(a,[]) //query from DB
            } catch(e) {
                console.error(`An error occurred:${e}`)
            }

            var instances  = this.db_instances

            for(var n in instances){
                if(instances[n].motherTable || instances[n].JSON){
                    response.map(itm=>{
                        itm[n] = JSON.parse(itm[n]) //parse each of them value if JSON OR M2M
                    })
                }
            }

            for(var n in instances){
                if(instances[n].motherTable){
                    let {table} = this.knowTable(n)
                    var Qq = `SELECT id_main_table, id_referenced_table FROM ${table}`
                    var m2mQueryReturn;
                    this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq) : m2mQueryReturn = await getQueryB(Qq)
                    //if !otherQuery
                    if(otherQuery.m2mValue === undefined || otherQuery.m2mValue[n] === undefined ){
                            response.map(itm=>{
                                m2mQueryReturn.map(items=>{
                                    if( itm.id === items.id_main_table ) {
                                        itm[n].push(items.id_referenced_table)

                                    }
                                })
                            })
                    } else {
                        var {motherTable} = this.knowTable(n)

                        for(var m=0;m<response.length;m++){
                            for(var k=0;k<m2mQueryReturn.length;k++){
                                if( response[m].id === m2mQueryReturn[k].id_main_table ) {
                                    var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                    //console.log(qq)
                                    var returnedQuery;
                                    this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,true) : returnedQuery = await getQueryB(qq,true)
                                    response[m][n].push(returnedQuery)
                                }
                            }
                        }
                    }
                }
            }
            return response
        })()
        return output
    }

    //collect table info
    collect(){
        var columns = []
        var dataTypes = {...this.db_instances}

        Object.keys(this.db_instances).map((itm)=>{
            columns.push(itm)
        })
        let tables = {table_name:`${this.table_fullname}`,columns,dataTypes,force:this.force,/*recentTable:this.tables,*/app_name:this.app_name}
        //console.log(tables)
        return tables
    }

    //add tables to each other
    append (m_query,a_query,join) {
        let main_query = m_query

        //append the value of each in the child table to the mother table
        var add = (m,y,z,lk,mk,pop,full_join,y_m)=>{
            let result = m
            if(Array.isArray(m)) {
                m.map((i,x)=>{
                    if(i[mk] == y[lk]){
                        if(result[x][z] !== null && !Array.isArray(result[x][z])){
                            result[x][z] = Array(result[x][z])
                            result[x][z].push(y)
                        } else if(Array.isArray(result[x][z])){
                            result[x][z].push(y)
                        }else{
                            result[x][z] = y
                        }
                        if(full_join) pop.push(y);
                    }
                })
            } else {
                if(m === null || y === null){
                    //pass
                } else {
                    if(m[mk] == y[lk]){
                        if(result[z] !== null && !Array.isArray(result[z])){
                            result[z] = Array(result[z])
                            result[z].push(y)
                        } else if(Array.isArray(result[z])){
                            result[z].push(y)
                        }else{
                            result[z] = y
                        }
                        if(full_join) y_m = null
                    }
                }
            }
            return result
        }

        //function for left joining
        function LeftJoin(a_query,join,main_query,pop,full_join){
            let lk,mk;
            join[n].Joiner ? mk = join[n].Joiner[0] : mk = 'id'
            join[n].Joiner ? lk = join[n].Joiner[1] : lk = 'id'

            if( Array.isArray(main_query) ) {
               main_query.map((itm)=>{itm[n] = null})
               a_query[n].map(y=>{
                    var get_it = add(main_query,y,n,lk,mk,pop,full_join,a_query[n])
                    main_query = get_it
                })
            } else {
                try{
                    main_query[n] = null
                    var get_it = add(main_query,a_query[n],n,lk,mk,pop,full_join)
                    main_query = get_it
                } catch(err) {
                    console.error(err)
                }
            }
            return main_query
        }

        //function for right joining
        function RightJoin(a_query,join,main_query){
            let lk,mk;
            join[n].Joiner ? mk = join[n].Joiner[0] : mk = 'id'
            join[n].Joiner ? lk = join[n].Joiner[1] : lk = 'id'
            if( Array.isArray(a_query[n]) ) {
               a_query[n].map((itm)=>{itm[n] = null})

               var main_queryMap = main_query
               main_queryMap.map(y=>{
                    var get_it = add(a_query[n],y,n,mk,lk)
                    main_query = get_it
                })
            } else {
                try{
                    a_query[n][n] = null
                    var get_it = add(a_query[n],main_query,n,mk,lk)
                    main_query = get_it
                } catch(err){
                    console.error(err)
                }
            }
            return main_query
        }


        //function for full joining
        function FullJoin(a_query,join,main_query,full_join){
            var pop = [] //contains the to be removed values
            LeftJoin(a_query,join,main_query,pop,full_join)
            pop.map(a=>{a_query[n].splice(a_query[n].indexOf(a),1)})
            //console.log(a_query[n].length)
            //checking if main_query is an array and if the current appending table list is not empty
            if( Array.isArray(main_query) && a_query[n].length !== 0 ) {
                for(var k=0;k<a_query[n].length;k++){
                    //creating new instance with null as their initial values 
                    var initInstance = main_query[0]
                    var instance = {}
                    for(var i in initInstance){
                        instance[i] = null
                    }
                    instance[n]=a_query[n][k]
                    var toAppend = instance
                    var index = []
                    //if the lastvalue of the main query is greater than that of the appending query
                    //Push it into the index
                    if(main_query[main_query.length-1]['id'] > a_query[n][k]['id']){
                        //console.log('i')
                        for(var h=0;h<main_query.length;h++){
                            if(main_query[h]['id'] < a_query[n][k]['id']){
                                index.push(main_query.indexOf(main_query[h]))
                            }
                        }
                    }

                    //if the index is empty append it at the last
                    if(index.length == 0){
                        toAppend.id = toAppend[n].id
                        main_query.push(toAppend)
                    } else { //if index is not empty fix it into its appropiate place usings its ID
                        toAppend.id = toAppend[n].id
                        main_query.splice(index[index.length-1]+1,0,toAppend)
                    }
                }
            } else if(a_query[n] !== undefined && !Array.isArray(a_query[n]) ){ //if appending table is not an array
                var initInstance = main_query
                var instance = {}
                for(var i in initInstance){
                    instance[i] = null
                }
                var toAppend = instance[n]=a_query[n]
                var mainQueryArray = Array(main_query)
                mainQueryArray.push(instance)
                main_query = mainQueryArray
            }
            return main_query
        }

        for(var n in a_query){
            try{
                if(a_query[n] === main_query){
                    throw 'The joiner should not be the same with the main query';
                } else {
                    if(join[n].Join === 'leftJoin') {
                        var leftJoin = LeftJoin(a_query,join,main_query)
                        main_query = leftJoin
                    } else if(join[n].Join === 'rightJoin') {
                        var rightJoin = RightJoin(a_query,join,main_query)
                        main_query = rightJoin
                    } else if(join[n].Join === 'fullJoin') {
                        var fullJoin = FullJoin(a_query,join,main_query,true)
                        main_query = fullJoin
                    } else if(join[n].Join === 'innerJoin'){
                        var innerJoin = LeftJoin(a_query,join,main_query)
                        main_query = innerJoin
                        var itemToRemove = []
                        main_query.map(x=>{
                            if(x[n] === null){
                                itemToRemove.push(x)
                            }
                        })
                        itemToRemove.map(x=>main_query.splice(main_query.indexOf(x),1))
                    }
                }
            } catch(err){
                console.error(err)
            }
        }
        return main_query
    }

    //adding to m2m column
    m2mA(ID,values){
        let {table} = this.knowTable(values[0]) //getting the column
        let {id} = ID //getting the id
        //iterating through the to be added values
        values[1].map(a=>{
            let q = this.db_name === 'sqite3' ? `INSERT INTO ${table} (id_main_table,id_referenced_table) VALUES (?,?)`
            : this.db_name === 'psql' ? `INSERT INTO ${table} (id_main_table,id_referenced_table) VALUES ($1,$2)`
            : this.db_name === 'mysql' ? `INSERT INTO ${table} (id_main_table,id_referenced_table) VALUES (?,?)`
            : null

            let qq = this.db_name === 'sqite3' ? `SELECT * FROM ${table} WHERE id_main_table=? AND id_referenced_table=?`
            : this.db_name === 'psql' ? `SELECT * FROM ${table} WHERE id_main_table=$1 AND id_referenced_table=$2`
            : this.db_name === 'mysql'  ?`SELECT * FROM ${table} WHERE id_main_table=? AND id_referenced_table=?`
            : null

            var param = [id,a]
            if(this.db_name === 'sqlite3'){
                (async()=>{
                    let QueryReturn = await getQueryA(qq,param,true)
                    //execute code only if QueryReturn is undefined
                    if (QueryReturn === undefined ) {
                        this.conn.run(q,param,(err)=>{
                            if(err) throw err
                        })
                    }
                    //console.log(QueryReturn)
                })()
            } else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
               (async()=>{
                    let QueryReturn = await getQueryB(qq,param,true)
                    if (QueryReturn === undefined ) {
                        this.conn.query(q,param,(err)=>{
                            if(err) throw err
                        })
                    }
                    //console.log(QueryReturn)
                })()
            }
        })
    }


    //deleting from an m2m column
    m2mD(ID,values){
        let {table} = this.knowTable(values[0]) // getting the column
        let {id} = ID //getting the id
        //iterating through to  be inserted values
        values[1].map(a=>{
            let q = this.db_name === 'sqlite3' ? `DELETE FROM ${table} WHERE id_main_table=? AND id_referenced_table=?`
            : this.db_name === 'psql' ? `DELETE FROM ${table} WHERE id_main_table=$1 AND id_referenced_table=$2`
            : this.db_name === 'mysql' ? `DELETE FROM ${table} WHERE id_main_table=? AND id_referenced_table=?`
            : null

            let qq = this.db_name === 'sqlite3' ? `SELECT * FROM ${table} WHERE id_main_table=? AND id_referenced_table=?`
            : this.db_name === 'psql' ?`SELECT * FROM ${table} WHERE id_main_table=$1 AND id_referenced_table=$2`
            : this.db_name === 'mysql' ? `SELECT * FROM ${table} WHERE id_main_table=? AND id_referenced_table=?`
            : null

            var param = [id,a]
            if(this.db_name === 'sqlite3'){
                (async()=>{
                    let QueryReturn = await getQueryA(qq,param,true)
                    //execute code only if QueryReturn is defined
                    if (QueryReturn) {
                        this.conn.run(q,param,(err)=>{
                            if(err) throw err
                        })
                    }
                    //console.log(QueryReturn)
                })()
            } else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
               (async()=>{
                    let QueryReturn = await getQueryB(qq,param,true)
                    //console.log(q)
                    if (QueryReturn) {
                        this.conn.query(q,param,(err)=>{
                            if(err) throw err
                        })
                    }
                    //console.log(QueryReturn)
                })()
            }
        })
    }

    //getting the m2m value of a child value
    getM2MChild(a,arg){
        var output = (async()=>{
            var {Table} = arg
            var {Query} = arg
            var {QuerySupplement} = arg
            var pointer = a.id //the instance looking for its m2m child
            var table = `${this.app_name}_${Table.table_name}__${this.table_fullname}`
            var qq = `SELECT * FROM ${table} WHERE id_referenced_table='${pointer}'`
            var returnedQuery;
            this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,[]) : returnedQuery = await getQueryB(qq,[])//query DB

            var response = 'This instances has no child yet\n'
           if(returnedQuery.length !== 0){
                let m2m = []; //hold the ids
                returnedQuery.map(itm=> m2m.push(itm.id_main_table))
                !Query ?  Query = {} : null
                Query['id'] = []
                Query['id'].push(m2m)

                response = await Table.extract(Query,QuerySupplement)
           }
            return response
        })()
        return output
    }

    //handling raw codes
    rawHTML(arg){
        var output = (async()=>{
            try{
                var returnee = 'Command successful';

                if(!arg.params) throw 'no params given'

                //if statementType is fetchALL
                if(arg.statementType === 'fetchAll'){
                    if(arg.M2M || arg.JSON){
                        var query = await this.all()
                        returnee = query
                    } else {
                        this.db_name === 'sqlite3' ? returnee = await getQueryA(arg.statement,arg.params) : returnee = await getQueryB(arg.statement,arg.params)
                    }
                } else if(arg.statementType === 'fetchWhere'){ //if statementType is fetchWhere
                    if(arg.M2M || arg.JSON){
                        var query = await this.extract(arg.statement,{statementGiven:true})
                        returnee = query
                    } else {
                        this.db_name === 'sqlite3' ? returnee = await getQueryA(arg.statement,arg.params) : returnee = await getQueryB(arg.statement,arg.params)
                    }
                } else if(arg.statementType === 'command'){
                    if(this.db_name === 'sqlite3'){
                        this.conn.run(arg.statement,arg.params,(err)=>{
                            if(err) returnee = 'Command not successful'; throw err
                        })
                    }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                        this.conn.query(arg.statement,arg.params,(err)=>{
                            if(err) returnee = 'Command not successful'; throw err
                        })
                    }
                }
                return returnee
            } catch(err){
                console.error(err)
            }
        })()
        return output
    }

    AddColumn(q){
        let m2mList = []
        let PK;
        let FK;
        var statements = []
        var statement = `ALTER TABLE ${this.table_fullname} ADD `
        if(q.columnBody.motherTable){
            //init table
            var m2mTable = `${this.table_fullname}__${this.app_name}_${q.columnBody.motherTable}`
            m2mList.push([`${this.app_name}_${q.columnBody.motherTable}`,m2mTable])
        }
        let __r__ = `${q.columnHead.toString()} ${q.columnBody.value.toString()}`;
        var statement1 = statement+__r__

        statements.push(statement1)
        if ( q.columnBody.primaryKey ){
            PK = `CONSTRAINT PK_${this.table_fullname}__${q.columnHead} PRIMARY KEY(${q.columnHead})`
            var statement2 = statement+PK
            statements.push(statement2)
        }

        if ( q.columnBody.referencedTable ){
            var {referencedTable} = q.columnBody
            FK = `CONSTRAINT FK_${this.table_fullname}__${q.columnHead} FOREIGN KEY (${f}) REFERENCES ${this.app_name}_${referencedTable}(id) ON DELETE CASCADE ON UPDATE CASCADE`
            var statement2 = statement+FK
            statements.push(statement2)
        }

        try{
            if(q.columnBody.qNull.includes('NOT NULL') && q.columnBody.qDefaultValue.includes('DEFAULT')){
                statements.map(x=>{
                    if(this.db_name === 'sqlite3'){
                        this.conn.run(x,(err)=>{
                            if(err) throw err
                            console.log(`Added column ${q.columnHead} to Table ${this.table_fullname}`)
                        })
                    }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                        this.conn.query(x,(err)=>{
                            if(err) throw err
                            console.log(`Added column ${q.columnHead} to Table ${this.table_fullname}`)
                        })
                    }
                })
                m2mList.map(itm=>this.createM2MTable(itm[0],itm[1],this.table_fullname))
            } else if(q.columnBody.qNull.includes('NOT NULL') && !(q.columnBody.qDefaultValue.includes('DEFAULT'))){
                throw `A default value must be specified when "${q.columnHead}" is set to NOT NULL`
            }
        } catch(err) {
            console.error(err)
        }
    }

    RenameColumn(q){
        var query = `ALTER TABLE ${this.table_fullname }
                    RENAME COLUMN ${q.initialHead} TO ${q.columnHead}` ;

        if(this.db_name === 'sqlite3'){
            this.conn.run(query,(err)=>{
                if(err) throw err
            })
        }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
            this.conn.query(query,(err)=>{
                if(err){
                    throw err 
                };
            })
        }

    }

    ChangeTableName(q){
        var query = `ALTER TABLE ${q.old_name} RENAME TO ${q.new_name}`;

        if(this.db_name === 'sqlite3'){
            this.conn.run(query,(err)=>{
                if(err) throw err ;
            })
        }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
            this.conn.query(query,(err)=>{
                if(err) throw err ; 
            })
        }

    }

    paginate(q){
        let limit = q.limit
        let skip = q.skip
        let list = q.query
        var result;

        skip === undefined ? skip = 0 : null
        limit === undefined ? limit = parseInt(list.length-1): null
        result = list.slice(skip,limit+skip)
        return result
    }

    UpdateColumn(q){
        // var query = `ALTER TABLE ${this.table_fullname} RENAME TO ${this.table_fullname}_old`

        /*var handleLastCommandSqlite = async()=>{
            this.drop({instances:q.DT,table:`${this.table_fullname}_old`})
            var tableFullname = await this.create()
            var columns = Object.keys(this.db_instances).join(',')
            setTimeout(async()=>{
                var query2 = `INSERT INTO ${tableFullname} (${columns}) SELECT ${columns} FROM ${tableFullname}_proto_`
                console.log(query2)
                this.conn.run(query2,(err)=>{
                    if(err) throw err
                    this.drop({table:`${tableFullname}_proto_`})
                })
            },1000)
        }*/
        /*var handleLastCommandOthers = async()=>{
            this.drop({instances:q.DT,table:`${this.table_fullname}_old`})
            var tableFullname = await this.create()
            var columns = Object.keys(this.db_instances).join(',')
            setTimeout(async()=>{
                var query2 = `INSERT INTO ${tableFullname} (${columns}) SELECT ${columns} FROM ${tableFullname}_proto_`
                console.log(query2)
                this.conn.query(query2,(err)=>{
                    if(err) throw err
                    this.drop({table:`${tableFullname}_proto_`})
                })
            },1000)
        }
        var handleOthers = async (err)=>{
            if(err) throw err;
            var tableFullname = await this.create(`${this.table_fullname}_proto_`)
            var columns_proto_ = Object.keys(q.DT).join(',')
            setTimeout(async()=>{
                var query_proto_ = `INSERT INTO ${tableFullname} (${columns_proto_}) SELECT ${columns_proto_} FROM ${this.table_fullname}_old`
                console.log(query_proto_)
                if(this.db_name === 'sqlite3'){
                    await this.conn.run(query_proto_,async(err)=>{
                        if(err) throw err;
                        await handleLastCommandSqlite()
                    })
                }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                    this.conn.query(query_proto_,async(err)=>{
                        if(err) throw err
                        await handleLastCommandOthers()
                    })
                }
            },1000)
        }
        if(this.db_name === 'sqlite3'){
            this.conn.run(query,handleOthers)
        }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
            this.conn.query(query,handleOthers)
        }*/

        var handlePsqlConstraint = (column)=>{
            
            if(this.db_name === 'psql'){
                var addConstraints = []
                var removeConstraints = []
                var keys = Object.keys(column.columnBody)
                if(keys.includes('NULL')){
                    if(column.columnBody.NULL == 'YES'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} SET NULL` 
                        addConstraints.push(statement)
                    } else if(column.columnBody.NULL == 'NO'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} SET NOT NULL` 
                        removeConstraints.push(statement)
                    } 
                }
                if(keys.includes('DefaultValue')){
                    if(column.columnBody.DefaultValue == 'YES'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} SET DEFAULT=${column.columnBody.qDefaultValue}` 
                        addConstraints.push(statement)
                    } else if(column.columnBody.DefaultValue == 'NO'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} DROP DEFAULT`
                        removeConstraints.push(statement)
                    } 
                }
                if(keys.includes('Width')){
                    if(column.columnBody.Width == 'YES'){
                        if(column.columnBody.dataType == ('Decimal' || 'Float')){
                            let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} TYPE ${column.columnBody.dataType}(${column.columnBody.qWidth}${column.columnBody.qDecimalPlace})` 
                            addConstraints.push(statement)
                        } else {
                            let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} TYPE ${column.columnBody.dataType}${column.columnBody.qWidth}` 
                            addConstraints.push(statement)
                        }
                    } else if(column.columnBody.Width == 'NO'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} TYPE ${column.columnBody.dataType}`
                        removeConstraints.push(statement)
                    } 
                }
                if(keys.includes('Unique')){
                    if(column.columnBody.Unique == 'YES'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} SET UNIQUE`
                        addConstraints.push(statement)
                    } else if(column.columnBody.Unique == 'NO'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} DROP UNIQUE`
                        removeConstraints.push(statement)
                    } 
                }
                if(keys.includes('DecimalPlace')){
                    if(column.columnBody.DecimalPlace == 'YES'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} TYPE Decimal(${column.columnBody.qWidth}${column.columnBody.qDecimalPlace})`
                        addConstraints.push(statement)
                    } else if(column.columnBody.DecimalPlace == 'NO'){
                        let statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN ${column.columnHead} TYPE Decimal(${column.columnBody.qWidth})`
                        removeConstraints.push(statement)
                    } 
                }

                addConstraints.map(i=>{
                    //console.log(i)
                    this.conn.query(i,(err)=>{
                        if(err) throw err
                    })
                })

                removeConstraints.map(i=>{
                    //console.log(i)
                    this.conn.query(i,(err)=>{
                        if(err) throw err
                    })
                })
            }
        }

        let m2mList = []
        let PK;
        let FK;
        var statements = [];
        var statement = `ALTER TABLE ${this.table_fullname} ALTER COLUMN `
        var addConstraint = `ALTER TABLE ${this.table_fullname} ADD `
        var removeConstraint = `ALTER TABLE ${this.table_fullname} DROP `
        this.db_name === 'mysql' ? statement =  `ALTER TABLE ${this.table_fullname} MODIFY COLUMN ` : null
            if(q.columnBody.m2m === 'YES'){
                //init table
                var m2mTable = `${this.table_fullname}__${this.app_name}_${q.columnBody.motherTable}`
                m2mList.push([`${this.app_name}_${q.columnBody.motherTable}`,m2mTable])
            }
            if(this.db_name !== 'psql'){
                let  __r__ = `${q.columnHead.toString()} ${q.columnBody.value.toString()}` 
                var statement1 = statement+__r__
                statements.push(statement1)
                
            }else if(this.db_name === 'psql' && q.columnBody.DataType === 'YES'){
                let  __r__ = `${q.columnHead.toString()} TYPE ${q.columnBody.dataType.toString()} USING ${q.columnHead.toString()}::${q.columnBody.dataType}`
                var statement1 = statement+__r__
                statements.push(statement1)
                
            }
            if ( q.columnBody.PK === 'YES' ){
                PK = ` CONSTRAINT PK_${this.table_fullname}__${q.columnHead} PRIMARY KEY(${q.columnHead})`
                    var statement2 = addConstraint+PK
                    statements.push(statement2)
            }

            if ( q.columnBody.FK === 'YES' ){
                var {referencedTable} = q.columnBody
                FK = ` CONSTRAINT FK_${this.table_fullname}__${q.columnHead} FOREIGN KEY (${f}) REFERENCES ${this.app_name}_${referencedTable}(id) ON DELETE CASCADE ON UPDATE CASCADE`
                var statement2 = addConstraint+FK
                statements.push(statement2)
            }

            if(q.columnBody.m2m === 'NO'){
                var {table} = this.knowTable(q.columnHead)
                var dropIt = `DROP TABLE IF EXISTS ${table} CASCADE`
                statements.push(dropIt)
            }

            if ( q.columnBody.PK === 'NO' ){
                PK = `CONSTRAINT PK_${this.table_fullname}__${q.columnHead}`
                var statement2 = removeConstraint+PK
                statements.push(statement2)
            }

            if ( q.columnBody.FK === 'NO' ){
                var {referencedTable} = q.columnBody
                FK = `CONSTRAINT FK_${this.table_fullname}__${q.columnHead}`
                var statement2 = removeConstraint+FK
                statements.push(statement2)
            }
            //console.log(statements)
            
        handlePsqlConstraint(q)
        statements.map(x=>{
            this.conn.query(x,(err)=>{
                if(err) throw err 
                console.log(`Updated column ${q.columnHead} in Table ${this.table_fullname}`)
            })
        })
    
        m2mList.map(itm=>this.createM2MTable(itm[0],itm[1]))
    }

    DropColumn(q){
        var query = `ALTER TABLE ${this.table_fullname} DROP COLUMN  ${q.column}`;

        var SqliteDropColumn = ()=>{

            var query = `ALTER TABLE ${this.table_fullname} RENAME TO ${this.table_fullname}_old`

            var handleLastCommandSqlite = async()=>{
                this.drop({table:`${this.table_fullname}_old`})
                var Keys = Object.keys(this.db_instances)
                var cIndex = Keys.indexOf(`${q.column}`)
                Keys.splice(cIndex,1)
                var instances = {}
                Keys.map(i=>{
                    instances[i] = this.db_instances[i]
                })
                var columns = Keys.join(',')
                var tableFullname = await this.create({instances})
                setTimeout(async()=>{
                    try{
                        var query2 = `INSERT INTO ${tableFullname} (${columns}) SELECT ${columns} FROM ${tableFullname}_proto_`
                        //console.log(query2)
                        this.conn.run(query2,(err)=>{
                            if(err) throw err
                            this.drop({table:`${tableFullname}_proto_`})
                            
                        })
                    } catch(err){
                        console.error(err)
                    }
                },400)
            }

            var handleOthers = async(err)=>{
                if(err) throw err;
                var Keys = Object.keys(this.db_instances)
                var cIndex_proto = Keys.indexOf(`${q.column}`)
                Keys.splice(cIndex_proto,1)
                var instances_proto_ = {}
                Keys.map(i=>{
                    instances_proto_[i] = this.db_instances[i]
                })
                var columns_proto_ = Keys.join(',')
                var tableFullname = await this.create({instances:instances_proto_,table:`${this.table_fullname}_proto_`})
                setTimeout(async()=>{
                    try{
                        var query_proto_ = `INSERT INTO ${tableFullname} (${columns_proto_}) SELECT ${columns_proto_} FROM ${this.table_fullname}_old`
                        //console.log(query_proto_)

                        await this.conn.run(query_proto_,async(err)=>{
                            if(err) throw err;
                            await handleLastCommandSqlite()
                        })
                    } catch(err){
                        console.error(err)
                    }
                },400)
            }

            this.conn.run(query,handleOthers)
        }
                        
        if(this.db_name === 'sqlite3'){
            
            SqliteDropColumn()

        }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
            this.conn.query(query,(err)=>{
                if(err) throw err
                console.log(`Dropped column ${q.column} from Table ${this.table_fullname}`)
            })
        }

        let cascade = ''
        this.db_name !== 'sqlite3' && this.db_name === 'psql' ||  this.db_name === 'mysql' ? cascade = 'CASCADE' : null ;

        if(q.m2m){
            var {table} = this.knowTable(q.column)
            var qq = `DROP TABLE IF EXISTS ${table} ${cascade}`
            if(this.db_name === 'sqlite3'){
                this.conn.run(qq,(err)=>{
                    if(err) throw err
                })
            }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                this.conn.query(qq,(err)=>{
                    if(err) throw err
                })
            }
        }
    }

    Delete(q,given=false){
        var query = `DELETE FROM ${this.table_fullname} WHERE`
        var query2 = `DELETE FROM ${this.table_fullname} WHERE id='${q.id}'`
        var params = []
        var count__ = 1
        for(var each in q){
            var add_to_query = this.db_name == 'sqlite3' ? `${each} = ?`
            : this.db_name == 'psql' ? `${each} = $${count__}`
            : this.db_name == 'mysql' ?`${each} = ?`
            : null
            query += add_to_query
            params.push(q[each])
            count__++
        }
        if(given){
            if(this.db_name === 'sqlite3'){
                this.conn.run(query,params,(err)=>{
                    if(err) throw err
                })
            }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                this.conn.query(query,params,(err)=>{
                    if(err) throw err
                })
            }
        } else {
            if(this.db_name === 'sqlite3'){
                this.conn.run(query2,(err)=>{
                    if(err) throw err
                })
            }else if(this.db_name === 'psql' ||  this.db_name === 'mysql'){
                this.conn.query(query2,(err)=>{
                    if(err) throw err
                })
            }
        }
    }
}


var initDataType = ( arg )=>{

    function field( argF ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUpdate = '';
        var qDelete = '';
        var qDecimal_place = '';
        var bracket = '';
        var primaryKey = false;
        var rename = [false, null] ;

        argF.Null ? qNull = '' : qNull = 'NOT NULL'
        argF.primaryKey ? primaryKey = true : primaryKey = false
        var __args__ = {qNull,primaryKey}

        if(arg.Width){
            argF.width ? qWidth = `${argF.width}` : qWidth = ''
            __args__['qWidth'] = qWidth
        }
        if(arg.Update){
            argF.onUpdate ? qUpdate = `ON UPDATE CASCADE` : qUpdate = ''
            __args__['qUpdate'] = qUpdate
        }
        if(arg.Delete){
            argF.onDelete ? qDelete = `ON DELETE CASCADE` : qDelete = ''
            __args__['qDelete'] = qDelete
        }
        if(arg.Decimal_Places){
            argF.decimal_places ? qDecimal_place = `,${argF.decimal_places}` : qDecimal_place = ''
            __args__['qDecimal_place'] = qDecimal_place
        }

        if(arg.DefaultValue){
            argF.defaultValue ? qDefaultValue = `DEFAULT '${argF.defaultValue}'` : qDefaultValue = ''
            __args__['qDefaultValue'] = qDefaultValue
        }

        if(arg.Decimal_Places && arg.Width){
            bracket = `(${qWidth}${qDecimal_place})`
        } else if(arg.Decimal_Places) {
            bracket = `(${qDecimal_place})`
        } else if( arg.Width ) {
            bracket = `(${qWidth})`
        } else {
            bracket = ''
        }

        return {value:`${arg.name}${bracket} ${qDefaultValue} ${qUpdate} ${qDelete} ${qNull}`,rename,primaryKey,dataType:arg.name,...__args__}
    }
    return {field}
}

class DataType{

    constructor(){
    }

    qBigInt( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = false;
        var rename = [false, null] ;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : qUnique = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        return {value:`BigInt${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey, rename, dataType:'BigInt',...__args__}
    }

    qBit( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique = '';
        var primaryKey = '';
        var rename = [false, null] ;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qUnique}

        return {value:`Bit${qWdth} ${qDefaultValue} ${qNull}`,primaryKey, rename, dataType:'Bit',...__args__}
    }

    qJson(arg) {
        var length = 100 ;
        var rename = [false, null];

        if(arg){
            arg.rename ? rename = arg.rename : rename = [false, null]
            arg.length ? length = arg.length : length = 100
        }
        var __args__ = {qWidth:length,qNull:'',qDefaultValue:'',qUnique:''}
        return {value:this.qVarchar({width:length}).value,JSON:true, rename, dataType:'Varchar',...__args__}
    }

    qSmallInt( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = false;
        var rename = [false, null] ;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        return {value:`SmallInt${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey, rename,dataType:'SmallInt',...__args__}
    }

    qDecimal( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = '';
        var qWidth = 10;
        var qUnique ='';
        var qDecimalPlace = 2;
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.width ? qWidth = arg.width : qWidth = 10
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.decimal_places ? qDecimalPlace = `,${arg.decimal_places}` : qDecimalPlace = 2
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qDecimalPlace,qUnique}

        return {value:`Decimal(${qWidth}${qDecimalPlace}) ${qDefaultValue} ${qNull}`,primaryKey, rename,dataType:'Decimal',...__args__}
    }

    qSmallMoney( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique = '';
        var primaryKey = false;
        var rename = [false, null] ;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qUnique}

        return {value:`SmallMoney ${qDefaultValue} ${qNull}`,primaryKey,rename,dataType:'SmallMoney',...__args__}
    }

    qInt( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = '';
        var rename = [false, null] ;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        let output;
        if(db_connection.db_name === 'sqlite3'){
            output = {value:`Integer ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey, rename, dataType:'Integer',...__args__}
        } else {
            output = {value:`Int${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey, rename, dataType:'Int',...__args__}
        }

        return output
    }

    qTinyInt( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = false;
        var rename = [false, null] ;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        return {value:`TinyInt${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey,rename,dataType:'TinyInt',...__args__}
    }

    qMoney( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique
        var primaryKey = '';
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qUnique}

        return {value:`Money ${qDefaultValue} ${qNull}`,primaryKey, rename, dataType:'Money',...__args__}
    }

    qFloat( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = 10;
        var qDecimalPlace = 2;
        var qUnique = '';
        var primaryKey = false;
        var rename = [false, null] ;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.width ? qWidth = arg.width : qWidth = 10
            arg.decimal_places ? qDecimalPlace = `,${arg.decimal_places}` : qDecimalPlace = 2
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        return {value:`Float(${qWidth}${qDecimalPlace}) ${qDefaultValue} ${qNull}`,rename,dataType:'Float',primaryKey,...__args__}
    }

    qDate( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique = '';
        var qAutoUpdate = false
        var primaryKey = false;
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
            arg.AutoUpdate ? qAutoUpdate = true : qAutoUpdate = false
        }

        function AutoFunc(){
            return new Date().toDateString()
        }

        var __args__ = {qNull,qUnique,qDefaultValue,qAutoUpdate}
        return {value:`Date ${qDefaultValue} ${qNull}`,primaryKey,rename,AutoFunc,dataType:'Date',...__args__}
    }

    qDatetime( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique = '';
        var qAutoUpdate = false;
        var primaryKey = '';
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.qUnique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
            arg.AutoUpdate ? qAutoUpdate = true : qAutoUpdate = false
        }

        function AutoFunc(){
            return new Date().toISOString()
        }

        var __args__ = {qNull,qDefaultValue,qUnique,qAutoUpdate}

        return {value:`DateTime ${qDefaultValue} ${qNull} ON UPDATE CASCADE`,primaryKey,rename,AutoFunc,dataType:'DateTime',...__args__}
    }

    qSmallDatetime( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qAutoUpdate = false;
        var primaryKey = false;
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
            arg.AutoUpdate ? qAutoUpdate = true : qAutoUpdate = false
        }

        function AutoFunc(){
            return new Date().toISOString()
        }

        var __args__ = {qNull,qDefaultValue,qAutoUpdate}

        return {value:`SmallDateTime ${qDefaultValue} ${qNull} ON UPDATE CASCADE`,primaryKey,rename,AutoFunc,dataType:'SmallDateTime',...__args__}
    }

    qTime( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qAutoUpdate = false
        var primaryKey = '';
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
            arg.AutoUpdate ? qAutoUpdate = true : qAutoUpdate = false
        }

        function AutoFunc(){
            return new Date().toTimeString()
        }
        
        var __args__ = {qAutoUpdate,qNull,qDefaultValue}

        return {value:`Time ${qDefaultValue} ${qNull}`,primaryKey,rename,AutoFunc,dataType:'Time',...__args__}
    }

    qChar( arg ) {
        var qNull;
        var qDefaultValue;
        var qWidth;
        var qUnique;
        var primaryKey;
        var rename =  false ;

        if(!arg) throw 'Please make sure you define the width'

        if(arg){
            if(!arg.width) throw 'Please make sure you define the width !!!'
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        return {value:`Char${qWidth} ${qDefaultValue} ${qNull}`,primaryKey,rename,dataType:'Char',...__args__}
    }

    qVarchar(arg) {
        var qNull
        var qDefaultValue;
        var qWidth;
        var qUnique;
        var primaryKey;
        var rename = [false, null] ;

        if(!arg) throw 'Please make sure you define the width !!!'

        if(arg){
            if(!arg.width) throw 'Please make sure you define the width !!!'
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        return {value:`Varchar${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey,rename,dataType:'Varchar',...__args__}
    }

    qText( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique = '';
        var primaryKey = false;
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qUnique}

        return {value:`Text ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey,rename,dataType:'Text',...__args__}
    }

    qNChar( arg ) {
        var qNull;
        var qDefaultValue;
        var qWidth;
        var qUnique;
        var primaryKey;
        var rename = [false, null] ;

        if(!arg) throw 'Please make sure you define the width'

        if(arg){
            if(!arg.width) throw 'Please make sure you define the width'
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = true
            arg.rename ? rename = arg.rename : rename = arg.rename
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        return {value:`NChar ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey,rename,dataType:`NChar`,...__args__}
    }

    qNVarchar( arg ) {
        var qNull;
        var qDefaultValue;
        var qWidth;
        var qUnique;
        var primaryKey;
        var rename = [false, null]

        if(!arg.width) throw 'Please make sure you define the width'

        if(arg){
            if(!arg.width) throw 'Please make sure you define the width'
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qWidth,qUnique}

        return {value:`NVarchar${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey,rename,dataType:`NVarchar`,...__args__}
    }

    qNText( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique = '';
        var primaryKey = false;
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue,qUnique}

        return {value:`NText ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey,rename,dataType:`NText`,...__args__}
    }

    qBinary( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = false;
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qWidth,qDefaultValue,qWidth,qUnique}

        return {value:`Binary${qWidth} ${qDefaultValue} ${qNull}`,primaryKey, rename, dataType:`Binary`,...__args__}
    }

    qVarBinary( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = false;
        var rename  = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true: primaryKey = false
            arg.rename ? rename = arg.rename: rename = [false, null]
        }
        var __args__ = {qNull,qUnique,qDefaultValue,qWidth}

        return {value:`VarBinary${qWidth} ${qDefaultValue} ${qNull}`,primaryKey, rename, dataType:`VarBinary`,...__args__}
    }

    qImage( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = false;
        var rename = [false, null];

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue}

        return {value:`Image ${qDefaultValue} ${qNull}`,primaryKey,rename,dataType:`Image`,...__args__}
    }

    qBoolean( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = false;
        var rename = [false, null] ;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue && arg.defaultValue !== (null && '') ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.rename ? rename = arg.rename : rename = [false, null]
        }
        var __args__ = {qNull,qDefaultValue}

        return {value:`Boolean ${qDefaultValue} ${qNull}`,primaryKey,rename, dataType:`Boolean`,...__args__}
    }

    qForeignKey(referencedTable){
        var {value} = this.qInt()
        return {value,referencedTable,dataType:`Int`}
    }

    qM2MKey(motherTable){
        var dValue = JSON.stringify([])
        var {value}  = this.qVarchar({width:10,defaultValue:dValue})
        return {value,motherTable,dataType:`Varchar`,m2m:true}
    }
}

//var __ = new DataType()
//var e = {favourite:Operators().isIn(['blue']),male:true}
//var myTable2 = new QuickTable('SOLI',{name:__.qVarchar({width:100}),age:__.qInt()})
//var myTable4 = new QuickTable('MADZ_old',{name:__.qVarchar({width:100}),age:__.qInt()})
//var myTable5 = new QuickTable('MADZ_proto_',{name:__.qVarchar({width:100}),age:__.qInt()})
//var myTable = new QuickTable('MADZ',{name:__.qVarchar({Null:false,unique:true,width:100}),soli:__.qM2MKey('SOLI'),ace:__.qInt()})
//var myTable3 = new QuickTable('Capacity', {ike:__.qJson(),height:__.qInt(),muscleSize:__.qVarchar({width:10,primaryKey:true}), madz:__.qForeignKey('SOLI'),age:__.qBoolean()})
//myTable.insert({name:'cs',soli:Operators().m2mI([2],2),age:'20'});
//myTable2.insert({name:'ie',age:'20'});
//myTable3.insert({muscleSize:'big',madz:4,height:22,age:20,ike:[3,4,5]})
/*var c = (async()=>{
    //let response2 = await myTable.extract({id:[[2,4]]},{m2mValue:{soli:'*'}})
    //let key = response2[response2.length-1].id+1
    //myTable.insert({name:'nw',soli:Operators().m2mI([2],key),age:'20'});
    //myTable2.insert({name:'ike',age:'20'});
    //let response = await myTable2.find({id:1})
    let response3 = await myTable3.all()
    //let appendData = myTable.append(response3,{love:m,passion:response},{love:{Join:'leftJoin'},passion:{Joiner:['id','madz'],Join:'innerJoin'}})
    //myTable.m2mA(response2[0],['soli',[2]])
    //myTable.m2mD(response2[0],['soli',[2]])
    //console.log(response2[0])
    //console.log(response)
    //console.log(response3)
    /*var s = await myTable2.getM2MChild(response,{
        Table:myTable,
        Query:{
            name:'nwa'
        },
        QuerySupplement:{
            m2mValue:{
                soli:'name'
            }
        }
    })
    //var d = await myTable.rawHTML({statement:`SELECT * FROM xatisfy_MADZ`,statementType:'fetchWhere',JSON:true})
    //console.log(s[0].soli)
    console.log(response3)
})()*/
// myTable2.create()
// myTable.create()
//myTable3.drop()
// myTable4.drop()
// myTable5.drop()
// var dataTy = {"ike":{"value":"Varchar(100)   NOT NULL","JSON":true,"dataType":"Varchar","qWidth":100},"height":{"value":"Int   ","primaryKey":"","dataType":"Int","qNull":"","qDefaultValue":"","qWidth":"","qUnique":""},"muscleSize":{"value":"Varchar(10)   NOT NULL","primaryKey":true,"dataType":"Varchar","qNull":"NOT NULL","qDefaultValue":"","qWidth":"(10)","qUnique":""},"madz":{"value":"Int   ","referencedTable":"SOLI","dataType":"Int"},"age":{"value":"Int   ","primaryKey":"","dataType":"Int",}}
// myTable3.UpdateColumn({Table:"Table3",DT:dataTy})
/*var t = initDataType({name:'MADZWORLD',Width:true,Update:true,Delete:true,DefaultValue:true, Decimal_Places:true})
var d = t.field({Null:true,defaultValue:'soli',onUpdate:true,onDelete:true,width:10,primaryKey:false, decimal_places:10})
console.log(d)*/

module.exports = {QuickTable,Ops:Operators(),__:new DataType(),initDataType}
//module.exports = {myTable2,myTable,myTable3}