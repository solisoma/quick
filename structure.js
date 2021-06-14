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
            let _i_i_ = 0
            let _i_counter__ = parseInt(Object.keys(_values).length-1)

            let __columns__ = `INSERT INTO ${table_name}(`
            let __values__ = '('
            let _v_length = Object.keys(_values).length

            for(var f in _values){
                if(_v_length == 1){
                    __columns__+=f.toString();
                    __values__+=_values[f].toString();
                }else{
                    if(_i_i_ < _i_counter__){
                        __columns__+= `f.toString(),`;
                        __values__+= `_values[f].toString(),`;
                    }else{
                        __columns__+=f.toString();
                        __values__+=_values[f].toString();
                    }
                    _i_i_++
                }
            }
            __columns__+=')'
            __values__+=')'
            statement = __columns__+__values__

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
        let find = (query,val=null,order=null,distinct=false,conDefault='AND',conOrder=[])=>{
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
                    if(query[i] == ''){
                        __add__ = `${i} IS NULL`
                    } else {
                        __add__ = `${i}=${query[i]}`
                    }
                    q+= __add__
                } else {
                    let __add__;
                    if(z < __counter_){
                        if(query[i] == ''){
                            __add__ = `${i} IS NULL`
                        } else {
                            __add__ = `${i}=${query[i]}`
                        }
                        let __add_condition;
                        if(conDefault === 'AND'){
                            __add_condition = ` AND `
                        } else {
                            __add_condition = ` ${conOrder[z]} `
                        }
                        __add__+= __add_condition
                        q+= __add__
                    } else {
                        if(query[i] == ''){
                            __add__ = `${i} IS NULL`
                        } else {
                            __add__ = `${i}=${query[i]}`
                        }
                        q+= __add__
                    }
                }
                z++
            }
            q+=order_
            console.log(q)
        }

        //pull all from the database
        let all = ()=>{
            let a = `SELECT * FROM ${table_name}`
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
    quickCard(){
        let not_in = () =>{}
        let begin = () =>{}
        let not_begin = () =>{}
        let end = () =>{}
        let not_end = () =>{}
        let begin_and_end = () =>{}

        return {not_in:not_in,begin:begin,not_begin:not_begin,end:end,not_end:not_end,begin_and_end:begin_and_end}
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
var e = {favourite:'Varchar(200)',male:''}
var myTable = table.define('SOLI',{name:'Varchar(200)',age:'int'},extra=e)
myTable.find({name:'ikechukwu',love:'yes',...e},val=null,order='>name,love',distinct=true)
