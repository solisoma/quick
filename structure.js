//contains both the fields and function to create tables

let {db_connection} = require('./index.js')
let {tables} = require('./strt_tracker.js')

//methods of table = define, drop, find, extract, append, val, order, collect, insert

//function to create table
class QuickTable{
    constructor(){
        this.conn = db_connection.connector
        this.db_name = db_connection.db_name
        this.tables = tables
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

    define(table_name,db_instances,extra=null,force=false){

        let create = ()=>{
            var _d_list = Object.keys(db_instances)
            var __counter__ = parseInt(_d_list.length-1)
            var i = 0
            var statement = `CREATE TABLE IF NOT EXISTS ${table_name}(`

            if(force){
                statement = `CREATE TABLE ${table_name}(`
            }

            if(extra !== null){
                for(var f in extra){
                    let __q__ = `${f.toString()} ${extra[f].toString()},`
                    statement += __q__
                }
                for(var f in db_instances){
                    let __r__;
                    if(_d_list.length == 1){
                         __r__ = `${f.toString()} ${db_instances[f].toString()}`;
                    }else{
                        if(i < __counter__){
                             __r__ = `${f.toString()} ${db_instances[f].toString()},`;
                        }else{
                             __r__ = `${f.toString()} ${db_instances[f].toString()}`;
                        }
                    }
                    i++
                    statement += __r__
                }
                statement += `)`
            }else{
                for(var f in db_instances){
                    if(_d_list.length === 1){
                        let __r__ = `${f.toString()} ${db_instances[f].toString()}`;
                        statement += __r__
                    }else{
                        let __r__ ;

                        if(i < __counter__){
                           __r__ = `${f.toString()} ${db_instances[f].toString()},`;
                        }else{
                           __r__ = `${f.toString()} ${db_instances[f].toString()}`;
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
        let drop = ()=>{
            var q = `DROP TABLE IF EXISTS ${table_name}`
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
        let insert = (_values)=>{
            let statement;
            let _i_i_ = 0
            let _i_counter__ = parseInt(Object.keys(_values).length-1)

            let __columns__ = `INSERT INTO ${table_name}(`
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
                this.conn.run(statement,[],(err,res)=>{
                    if(err) throw err
                    console.log(res)
                })
            }else{
                this.conn.query(statement,(err)=>{
                    if(err) throw err
                    console.log(/**/)
                })
            }
            return {values:_values,__statement__:statement}
        }

        //capture a single row from a table query = {name:what it is,condition:OR||AND||NOT},
        let find = (query,val=null,order=null,group=null,distinct=false)=>{
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
            let q = `${select} ${columns_} FROM ${table_name} WHERE `
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
            if(this.db_name == 'sqlite3'){
                this.conn.get(q,[],(err,res)=>{
                    if(err) throw err
                    console.log(res)
                })
            }else{
                this.conn.query(q,(err,res)=>{
                    if(err) throw err
                    console.log(res.rows[0])
                })
            }

        }

        //get all from db
        let extract = (query,val=null,order=null,group=null,distinct=false)=>{
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
            let q = `${select} ${columns_} FROM ${table_name} WHERE `
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
            if(this.db_name == 'sqlite3'){
                this.conn.all(q,[],(err,res)=>{
                    if(err) throw err
                    console.log(res)
                })
            }else{
                this.conn.query(q,(err,res)=>{
                    if(err) throw err
                    console.log(res.rows)
                })
            }

        }

        //pull all from the database
        let all = (val=null,order=null,group=null,distinct=false)=>{
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
            let a = `${select} ${columns_} FROM ${table_name}`
            a+=group_
            a+=order_
            if(this.db_name == 'sqlite3'){
                this.conn.run(a,(err,res)=>{
                    if(err) throw err
                    console.log(res)
                })
            }else{
                this.conn.query(a,(err,res)=>{
                    if(err) throw err
                    console.log(res.rows)
                })
            }

        }

        //save to db manually
        let save = ()=>{
            var __values_ = this.insert().__statement__

            if(this.db_name === 'sqlite3'){
                this.conn.run(__values_,[],(err,res)=>{
                    if(err) throw err
                })
            }else{
                this.conn.query(__values_,(err)=>{
                    if(err) throw err
                })
            }

        }

        //collect table info
        let collect = ()=>{
            var columns = []
            var dataTypes;

            if(extra === null){
                dataTypes = {...db_instances}
            }else{
                dataTypes = {...extra,...db_instances}
            }

            if(extra != null){
                Object.keys(extra).map((itm)=>{
                    columns.push(itm)
                })
            }

            Object.keys(db_instances).map((itm)=>{
                columns.push(itm)
            })
            let tables = {table_name,columns:columns,dataTypes:dataTypes,force:force}
            console.log(tables)
            return tables
        }

        return {drop:drop,insert:insert,all:all,collect:collect,create:create,save:save,find:find,extract:extract/*,append:append*/}
    }

    beginsWith(a,con){
        var c = ''
        if(con){ c = con }
        return `<{LIKE '${a}%'${c}}>`
    }

    endsWith(a,con){
        var c = ''
        if(con){ c = con }
        return `<{LIKE '%${a}'${c}}>`
    }

    begins_and_endswith(start='null',end='null',con){
        var c = ''
        if(con){ c = con }
        return `<{LIKE '${start}%${end}'${c}}>`
    }

    notIn(a,con){
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

    isIn(a,con){
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

    between(start='null',end='null',con){
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

    notBetween(start='null',end='null',con){
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

    contains(a,con){
        var c = ''
        if(con){ c = con }
        return `<{LIKE '%${a}%'${c}}>`
    }

    count(a,comma=false){
        var res;
        if(comma){
            res = `COUNT(${a}),`
        } else {
            res = `COUNT(${a})`
        }
        return res
    }

    avg(a,comma=false){
        var res;
        if(comma){
            res = `AVG(${a}),`
        } else {
            res = `AVG(${a})`
        }
        return res
    }

    sum(a,comma=false){
        var res;
        if(comma){
            res = `SUM(${a}),`
        } else {
            res = `SUM(${a})`
        }
        return res
    }

    max(a,comma=false){
        var res;
        if(comma){
            res = `MAX(${a}),`
        } else {
            res = `MAX(${a})`
        }
        return res
    }

    min(a,comma=false){
        var res;
        if(comma){
            res = `MIN(${a}),`
        } else {
            res = `MIN(${a})`
        }
        return res
    }

    gt(a){
        return `<{>'${a}'}>`
    }

    lt(a){
        return `<{<'${a}'}>`
    }

    gte(a){
        return `<{>='${a}'}>`
    }

    lte(a){
        return `<{<='${a}'}>`
    }
    dataTypes(){}
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
var main = [
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

//var a = append(main,{a:[query1,query1_body]}) or append(main,{a:[query1]})
var append = (m_query,a_query) => {
    let main_query = m_query
    console.log(m_query)

    var add = (m,y,z,lk)=>{
        let result = m
        m.map((i,x)=>{
            i[lk] === y[lk] ? result[x][z] = y :null
        })
        return result
    }

    for(var n in a_query){
        a_query[n][0].map(y=>{
            let lk;
            a_query[n][1] ? lk = a_query[n][1] : lk = 'id'
            var get_it = add(main_query,y,n,lk)
            main_query = get_it
        })
    }

    return main_query
}

var quick = new QuickTable()
var e = {favourite:quick.isIn(['red']),age:quick.gte(10)}
var myTable = quick.define('SOLI',{name:'Varchar(200)',age:'int'},extra=e)
var c = myTable.all()
var a = append(c,{house:[main,'favourite'],motor:[n,'age'],car:[m]})
console.log(a)

//how to change value on runtime
//append is based on id of the elements join them