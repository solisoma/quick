//contains both the fields and function to create tables

let {db_connection} = require('./index.js')
let {tables} = require('./strt_tracker.js')

//methods of table = define, drop, find, extract, append, val, order, collect, insert
var getQueryA = async(a,b)=>{
    return new Promise((resolve,reject) => {
        db_connection.connector.all(a,(err,rows) => {
           if(err){return reject(err);}
           if(b){
             resolve(rows[0])
           } else {
             resolve(rows)
           }
         });
    });
}

var getQueryB = async(a,b)=>{
    return new Promise((resolve,reject) => {
        db_connection.connector.query(a,(err,res) => {
           if(err){return reject(err);}
           if(b) {
            resolve(res.rows[0])
           } else {
            resolve(res.rows)
           }
         });
    });
}
//function to create table
class QuickTable{
    constructor(table_name,db_instances,extra=null,force=false){
        this.conn = db_connection.connector
        this.db_name = db_connection.db_name
        this.tables = tables
        this.table_name = table_name
        this.db_instances = db_instances
        this.extra = extra
        this.force = force
        this.addRow = {}
    }

    parseVal(val,fin){
        let conOrRegExp = /[A-Za-z0-9\.\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+(\_{1})/igm
        let conAndNotRegExp = /([A-Za-z0-9\.\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+)(\__{1})/igm
        let conOrNotRegExp = /([A-Za-z0-9\.\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+)(\___{1})/igm

        let checkOr = val.match(conOrRegExp)
        let checkAndNot = val.match(conAndNotRegExp)
        let checkOrNot = val.match(conOrNotRegExp)

        let result;

        if(checkOr){
            let regOr = /\_/igm
            let m_val = val.replace(regOr,'')
            if(fin){
                result = `='${m_val}'`
            } else {
                result = `='${m_val}' OR `
            }
        }
        if(checkAndNot){
            let regNot = /\__/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = `='${m_val}'`
            } else {
                result = `='${m_val}' AND NOT `
            }
        }
        if(checkOrNot){
            let regNot = /\___/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = `='${m_val}'`
            } else {
                result = `='${m_val}' OR NOT `
            }
        }
        if(!checkOrNot && !checkOr && !checkAndNot){
            let m_val = val
            if(fin){
                result = `='${m_val}'`
            } else {
                result = `='${m_val}' AND `
            }
        }
        return result
    }

    parseFunc(func){
        let RegExp = /\<\{[A-Za-z0-9\.\(\)\'\<\>\=\"\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+\}\>/igm
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

    parseFuncVal(val,fin){
        let conOrRegExp = /[A-Za-z0-9\.\:\;\(\)\#\$\%\^\&\*\_\-\@\?\/\,\<\>\=\'\"\s]+(\_{1})/igm
        let conAndNotRegExp = /([A-Za-z0-9\.\:\(\)\;\#\$\%\^\&\*\_\-\@\?\/\,\<\>\=\'\"\s]+)(\__{1})/igm
        let conOrNotRegExp = /([A-Za-z0-9\.\:\;\(\)\#\$\%\^\&\*\_\-\@\?\/\,\<\>\=\'\"\s]+)(\___{1})/igm

        let checkOr = val.match(conOrRegExp)
        let checkAndNot = val.match(conAndNotRegExp)
        let checkOrNot = val.match(conOrNotRegExp)

        let result;

        if(checkOr){
            let regOr = /\_/igm
            let m_val = val.replace(regOr,'')
            if(fin){
                result = ` ${m_val}`
            } else {
                result = ` ${m_val} OR `
            }
        }
        if(checkAndNot){
            let regNot = /\__/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = ` ${m_val}`
            } else {
                result = ` ${m_val} AND NOT `
            }
        }
        if(checkOrNot){
            let regNot = /\___/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = ` ${m_val}`
            } else {
                result = ` ${m_val} OR NOT `
            }
        }
        if(!checkOrNot && !checkOr && !checkAndNot){
            let m_val = val
            if(fin){
                result = ` ${m_val}`
            } else {
                result = ` ${m_val} AND `
            }
        }
        return result
    }

    parseAll(val,fin){
        let RegExp = /\<\{[A-Za-z0-9\.\(\)\'\<\>\=\"\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+\}\>/igm
        let check = val.match(RegExp)

        let result;

        if(check){
            let first_step = this.parseFunc(val)
            if(fin){
                result = this.parseFuncVal(first_step,fin)
            } else {
                result = this.parseFuncVal(first_step)
            }
        } else {
            if(fin){
                result = this.parseVal(val,fin)
            } else {
                result = this.parseVal(val)
            }
        }
        return result
    }

    create(){
        var _d_list = Object.keys(this.db_instances)
        var __counter__ = parseInt(_d_list.length-1)
        var i = 0
        var statement = `CREATE TABLE IF NOT EXISTS ${this.table_name}(`

        if(this.force){
            statement = `CREATE TABLE ${this.table_name}(`
        }

        if(this.extra !== null){
            for(var f in this.extra){
                let __q__ = `${f.toString()} ${this.extra[f].toString()},`
                statement += __q__
            }
            for(var f in this.db_instances){
                let __r__;
                if(_d_list.length == 1){
                     __r__ = `${f.toString()} ${this.db_instances[f].toString()}`;
                }else{
                    if(i < __counter__){
                         __r__ = `${f.toString()} ${this.db_instances[f].toString()},`;
                    }else{
                         __r__ = `${f.toString()} ${this.db_instances[f].toString()}`;
                    }
                }
                i++
                statement += __r__
            }
            statement += `)`
        }else{
            for(var f in this.db_instances){
                if(_d_list.length === 1){
                    let __r__ = `${f.toString()} ${this.db_instances[f].toString()}`;
                    statement += __r__
                }else{
                    let __r__ ;

                    if(i < __counter__){
                       __r__ = `${f.toString()} ${this.db_instances[f].toString()},`;
                    }else{
                       __r__ = `${f.toString()} ${this.db_instances[f].toString()}`;
                    }
                    i++
                    statement+=__r__
                }
            }
            statement += `)`
        }
        console.log(statement)
        if(this.db_name === 'sqlite3'){
            this.conn.run(statement,(err)=>{
                if(err) throw err
            })
        }else{
            this.conn.query(statement,(err)=>{
                if(err) throw err
            })
        }
    }

    //drop table if deleted from its structure's module
    drop(){
        var q = `DROP TABLE IF EXISTS ${this.table_name}`
        if(this.db_name === 'sqlite3'){
            this.conn.run(q,(err)=>{
                if(err) throw err;
            })
        }else{
            this.conn.query(q,(err,res)=>{
                if(err) throw err
            })
        }
    }

    //get from the table max_length = 1
    insert( _values ){
        let statement;
        let _i_i_ = 0
        let _i_counter__ = parseInt(Object.keys(_values).length-1)

        let __columns__ = `INSERT INTO ${this.table_name}(`
        let __values__ = '('
        let _v_length = Object.keys(_values).length

        for(var f in _values){
            if(_v_length == 1){
                __columns__+= `${f}`;
                __values__+=`'${_values[f]}'`;
            }else{
                if(_i_i_ < _i_counter__){
                    __columns__+= `${f},`;
                    __values__+= `'${_values[f]}',`;
                }else{
                    __columns__+=`${f}`;
                    __values__+=`'${_values[f]}'`;
                }
                _i_i_++
            }
        }
        __columns__+=')'
        __values__+=')'
        statement = `${__columns__} VALUES ${__values__}`

        if(this.db_name === 'sqlite3'){
            this.conn.run(statement,(err)=>{
                err ? console.log(err) : console.log(`values inserted into table ${this.table_name}`)
            })
        }else{
            this.conn.query(statement,(err,res)=>{
                if(err) throw err
                console.log(res)
            })
        }
    }

    updateRows( __values_ ) {
        var q = `UPDATE ${this.table_name} SET`
        var count = 0
        for(var i in __values_){
            var add = ` ${i}='${__values_[i]}'`
            if(  count < Object.keys(__values_).length - 1 ){
                console.log(i)
                add+=','
            }
            q+=add
            count++
        }
        q+= ` WHERE age=${__values_.age}`

        if(this.db_name === 'sqlite3'){
            this.conn.run(q,(err)=>{
                if(err) throw err
            })
        }else{
            this.conn.query(a,(err)=>{
                if(err) throw err
            })
        }
    }

    //capture a single row from a table query = {name:what it is,condition:OR||AND||NOT},
    find(query,val=null,order=null,group=null,distinct=false) {
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
        let q = `${select} ${columns_} FROM ${this.table_name} WHERE `
        let _index = Object.keys(query).length
        let __counter_ = _index - 1
        let z = 0
        for(var i in query){
            if(_index == 1){
                let __add__;
                if(query[i] == '' || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                    __add__ = `${i} IS NULL`
                } else {
                    __add__ = `${i}${this.parseAll(query[i],'final')}`
                }
                q+= __add__
            } else {
                let __add__;
                if(z < __counter_){
                    if(query[i] == '' || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                        __add__ = `${i} IS NULL`
                    } else {
                        __add__ = `${i}${this.parseAll(query[i])}`
                    }
                    q+= __add__
                } else {
                    if(query[i] == '' || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                        __add__ = `${i} IS NULL`
                    } else {
                        __add__ = `${i}${this.parseAll(query[i],'final')}`
                    }
                    q+= __add__
                }
            }
            z++
        }
        q+=group_
        q+=order_
        console.log(q)
        let response;
        try{
            this.db_name == 'sqlite3' ? response = (async()=> {return await getQueryA(q,true)})() : response = (async()=> {return await getQueryB(q)})()
        } catch(e) {
            console.log(`An error occurred:${e}`)
        }

        return response

    }


    //save to db manually
    save(query){
        this.updateRows(query)
    }

    //get all from db
    extract(query,val=null,order=null,group=null,distinct=false) {
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
        let q = `${select} ${columns_} FROM ${this.table_name} WHERE `
        let _index = Object.keys(query).length
        let __counter_ = _index - 1
        let z = 0
        for(var i in query){
            if(_index == 1){
                let __add__;
                if(query[i] == '' || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                    __add__ = `${i} IS NULL`
                } else {
                    __add__ = `${i}${this.parseAll(query[i],'final')}`
                }
                q+= __add__
            } else {
                let __add__;
                if(z < __counter_){
                    if(query[i] == '' || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                        __add__ = `${i} IS NULL`
                    } else {
                        __add__ = `${i}${this.parseAll(query[i])}`
                    }
                    q+= __add__
                } else {
                    if(query[i] == '' || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                        __add__ = `${i} IS NULL`
                    } else {
                        __add__ = `${i}${this.parseAll(query[i],'final')}`
                    }
                    q+= __add__
                }
            }
            z++
        }
        q+=group_
        q+=order_
        console.log(q)
        let response;
        try{
            this.db_name == 'sqlite3' ? response = (async()=> {return await getQueryA(q)})() : response = (async()=> {return await getQueryB(q)})()
        } catch(e) {
            console.log(`An error occurred:${e}`)
        }

        return response

    }

    //pull all from the database
    all(val=null,order=null,group=null,distinct=false) {
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
        let a = `${select} ${columns_} FROM ${this.table_name}`
        a+=group_
        a+=order_
        let response;
        try{
            this.db_name == 'sqlite3' ? response = (async()=>{return await getQueryA(a)})() : response = (async()=>{return await getQueryB(a)})()
        } catch(e) {
            console.log(`An error occurred:${e}`)
        }

        return response
    }

    //collect table info
    collect(){
        var columns = []
        var dataTypes;

        if(this.extra === null){
            dataTypes = {...this.db_instances}
        }else{
            dataTypes = {...this.extra,...this.db_instances}
        }

        if(this.extra != null){
            Object.keys(this.extra).map((itm)=>{
                columns.push(itm)
            })
        }

        Object.keys(this.db_instances).map((itm)=>{
            columns.push(itm)
        })
        let tables = {table_name:this.table_name,columns,dataTypes,force:this.force}
        console.log(tables)
        return tables
    }

    //var a = append(main,{a:[query1,query1_body]}) or append(main,{a:[query1]})
    append (m_query,a_query) {
        let main_query = m_query

        var add = (m,y,z,lk)=>{
            let result = m
            if(Array.isArray(m)) {
                m.map((i,x)=>{
                    i[lk] == y[lk] ? result[x][z] = y : null
                })
            } else {
                m[lk] == y[lk] ? result[z] = y : null
            }
            return result
        }

        for(var n in a_query){
            let lk;
            a_query[n][1] ? lk = a_query[n][1] : lk = 'id'
            if( Array.isArray(m) ) {
               a_query[n][0].map(y=>{
                    var get_it = add(main_query,y,n,lk)
                    main_query = get_it
                })
            } else {
                try{
                    var get_it = add(main_query,a_query[n][0],n,lk)
                    main_query = get_it
                } catch(err){
                    console.log(err)
                }
            }
        }
        return main_query
    }
    dataTypes(){}
}

let shorthands = () => {
    let beginsWith = (a,con) => {
        var c = ''
        if(con){ c = con }
        return `<{LIKE '${a}%'${c}}>`
    }

    let endsWith = (a,con) => {
        var c = ''
        if(con){ c = con }
        return `<{LIKE '%${a}'${c}}>`
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
        var res = ''
        if( typeof(start) == 'number' && typeof(end) == 'number' ){
            res = `<{BETWEEN ${start} AND ${end}${c}}>`
        } else {
            res = `<{BETWEEN '${start}' AND '${end}'${c}}>`
        }
        return res
    }

    let notBetween = (start='null',end='null',con) => {
        var c = ''
        if(con){ c = con }
        var res = ''
        if( typeof(start) == 'number' && typeof(end) == 'number' ){
            res = `<{NOT BETWEEN ${start} AND ${end}${c}}>`
        } else {
            res = `<{NOT BETWEEN '${start}' AND '${end}'${c}}>`
        }
        return res
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

    let gt = (a) => {
        return `<{>'${a}'}>`
    }

    let lt = (a) => {
        return `<{<'${a}'}>`
    }

    let gte = (a) => {
        return `<{>='${a}'}>`
    }

    let lte = (a) => {
        return `<{<='${a}'}>`
    }

    return {beginsWith, endsWith, begins_and_endswith, notIn, isIn,between, notBetween, contains, count, avg, sum, max, min, gt, lt, gte, lte}
}

var myDataType = (max_length=false,allowNull=false,name=null)=>{
    var name = ()=>{
        return 12
    }
    return {name:name}
}

/*
SELECT customerName, customercity, customermail, salestotal
FROM onlinecustomers AS oc
   INNER JOIN
   orders AS o
   ON oc.customerid = o.customerid
   ***WHERE CLAUSE COME IN***
   INNER JOIN
   sales AS s
   ON o.orderId = s.orderId
*/
/*var main = [
  {
    favourite: 'red',
    id:1,
    male: true,
    name: 'ikechukwu',
    love: 'yes',
    age: 10
  },
  {
    favourite: 'blue',
    id:2,
    male: true,
    name: 'solisoma',
    love: 'no',
    age: 19
  },
  {
    favourite: 'blue',
    id:3,
    male: true,
    name: 'alolisoma',
    love: 'no',
    age: 19
  },
  { favourite: 'red', id:4, male: false, name: null, love: 'yes', age: 19 }
]

var n = [
  {
    favourite: 'red',
    male: true,
    id:2,
    name: 'ikechukwu',
    love: 'yes',
    age: 10
  },
  {
    favourite: 'blue',
    male: true,
    id:1,
    name: 'solisoma',
    love: 'no',
    age: 19
  },
  {
    favourite: 'blue',
    male: true,
    id:4,
    name: 'alolisoma',
    love: 'no',
    age: 19
  },
  { favourite: 'red', id:3, male: false, name: null, love: 'yes', age: 19 }
]

var m = [
  {
    favourite: 'red',
    male: true,
    id:3,
    name: 'ikechukwu',
    love: 'yes',
    age: 10
  },
  {
    favourite: 'blue',
    male: true,
    id:2,
    name: 'solisoma',
    love: 'no',
    age: 19
  },
  {
    favourite: 'blue',
    male: true,
    id:4,
    name: 'alolisoma',
    love: 'no',
    age: 19
  },
  { favourite: 'red', id:1, male: false, name: null, love: 'yes', age: 19 }
]
*/

var e = {favourite:isIn(['red']),age:gte('10')}
var myTable = new QuickTable('SOLI',{name:'Varchar(200)',age:'int'},extra=e)
//myTable.insert({name:'ikechukwu',age:'10',favourite:'blue'});
var c = (async()=>{
    let response = await myTable.extract({name:'madzworld',...e},value='age,favourite,name',order='<age')
    let appendData = myTable.append(response,{'love':[main,'age']})
    console.log(appendData)
})()

//myTable.updateRows({name:'solisoma',favourite:'red',age:10})

//how to change value on runtime
//append is based on id of the elements join them