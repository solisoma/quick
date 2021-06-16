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
                result = `'${m_val}'`
            } else {
                result = `'${m_val}' OR `
            }
        }
        if(checkAndNot){
            let regNot = /\__/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = `'${m_val}'`
            } else {
                result = `'${m_val}' AND NOT `
            }
        }
        if(checkOrNot){
            let regNot = /\___/igm
            let m_val = val.replace(regNot,'')
            if(fin){
                result = `'${m_val}'`
            } else {
                result = `'${m_val}' OR NOT `
            }
        }
        if(!checkOrNot && !checkOr && !checkAndNot){
            let m_val = val
            if(fin){
                result = `'${m_val}'`
            } else {
                result = `'${m_val}' AND `
            }
        }
        return result
    }
    parseFunc(func){
        let RegExp = /\<\{[A-Za-z0-9\.\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+\}\>/igm
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

    parseAll(val,fin){
        let RegExp = /\<\{[A-Za-z0-9\.\:\;\#\$\%\^\&\*\_\-\@\?\/\,\s]+\}\>/igm
        let check = val.match(RegExp)

        let result;

        if(check){
            let first_step = this.parseFunc(val)
            if(fin){
                result = this.parseVal(first_step,fin)
            } else {
                result = this.parseVal(first_step)
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
            console.log(statement)

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
            return {_values:_values,__statement__:statement}
        }

        //capture a single row from a table query = {name:what it is,condition:OR||AND||NOT},
        let find = (query,val=null,order=null,distinct=false)=>{
            let columns_ = `*`
            let order_ = ``
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
                        __add__ = `${i}=${this.parseAll(query[i],'final')}`
                    }
                    q+= __add__
                } else {
                    let __add__;
                    if(z < __counter_){
                        if(query[i] == '' || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                            __add__ = `${i} IS NULL`
                        } else {
                            __add__ = `${i}=${this.parseAll(query[i])}`
                        }
                        q+= __add__
                    } else {
                        if(query[i] == '' || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                            __add__ = `${i} IS NULL`
                        } else {
                            __add__ = `${i}=${this.parseAll(query[i],'final')}`
                        }
                        q+= __add__
                    }
                }
                z++
            }
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
                    console.log(res.rows.map((inx)=>inx.favourite))
                })
            }

        }

        //pull all from the database
        let all = (order=null,distinct=false)=>{
            let order_ = ``
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
            let select;
            if(distinct){ select = `SELECT DISTINCT` } else { select = `SELECT` }
            let a = `${select} * FROM ${table_name}`
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
            let tables = {columns:columns,dataTypes:dataTypes,force:force}
            console.log(tables)
            return tables
        }

        return {drop:drop,insert:insert,all:all,collect:collect,create:create,save:save,find:find/*,extract:extract,append:append*/}
    }
    beginsWith(a,c){
        return `<{LIKE ${a}%${c}>`
    }
    endsWith(a,c){
        return `<{LIKE %${a}${c}}>`
    }
    begins_and_endswith(start='null',end='null',c){
        return `<{LIKE ${start}%${end}${c}}>`
    }
    notIn(a,c){
        return `NOT IN (${a}${c})`
    }
    isIn(a,c){
        return `<{IN (${a}${c})}>`
    }
    between(start='null',end='null',c){
        return `<{BETWEEN ${start} AND ${end}${c}}>`
    }
    notBetween(start='null',end='null',c){
        return `<{NOT BETWEEN ${start} AND ${end}${c}}>`
    }
    contains(a,con){
        let c = '__'
        if(con){ c = con }
        return `<{LIKE %${a}%${c}}>`
    }
    dataTypes(){}
}

var myDataType = (max_length=false,allowNull=false,name=null)=>{
    var name = ()=>{
        return 12
    }
    return {name:name}
}

var table = new QuickTable()
var e = {favourite:'red',male:'false',age:'19'}
var myTable = table.define('SOLI',{name:'Varchar(200)',age:'int'},extra=e)
myTable.find({name:'__'},val=null,order='name',distinct=false)

//how to change value on runtime