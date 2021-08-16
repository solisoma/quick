//contains both the fields and function to create tables

let {db_connection,app_name} = require('./index.js')
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


function Operators(){
    let beginsWith = (a,con) => {
        var c = ''
        if(con){ c = con }
        return `<{LIKE '${a}%'${c}}>`
    }

    let m2mI = (values,key) => {
        return {m2m:true,values,key}
    }

    let m2mQ = (values,contains) => {
        return {m2m:true,values,...contains}
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

    return {beginsWith, endsWith, begins_and_endswith, notIn, m2mI, m2mQ, isIn, between, notBetween, contains, count, avg, sum, max, min, gt, lt, gte, lte}
}

//function to create table
class QuickTable{
    constructor(table_name,db_instances,/*extra=null,*/force=false){
        this.conn = db_connection.connector
        this.db_name = db_connection.db_name
        this.app_name = app_name
        this.tables = tables
        this.table_name = table_name
        this.db_instances = db_instances
        //this.extra = extra
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
        let result;
        val = val.toString()
        if (val !== true && val !== false){
            let check = val.match(RegExp);
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
        } else {
            if( val === true ){
                result = `='true'`
            } else if( val === false ){
                result = `='false'`
            }
        }
        return result
    }

    knowTable(n){
        var columns__ = this.db_instances
        /*var e = this.extra
        var db_i = this.db_instances
        if(this.extra !== null){
            columns__ = {db_i,...e}
        }*/
        var output = columns__[n].motherTable

        return {table:`${this.app_name}_${this.table_name}__${this.app_name}_${output}`,motherTable:`${this.app_name}_${output}`}
    }

    createM2MTable(motherTable,m2mTable){
        //check if mother exist
        var int = this.db_name == 'sqlite3' ? 'INTEGER' : 'Int'
        var create_table = `CREATE TABLE IF NOT EXISTS ${m2mTable}(
            id_main_table ${int},
            id_referenced_table ${int},
            deleted Boolean DEFAULT false,
            CONSTRAINT FK_${this.app_name}__${this.table_name}_${motherTable} FOREIGN KEY (id_main_table) REFERENCES ${this.app_name}_${this.table_name}(id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT FK_${motherTable}__${this.app_name}_${this.table_name} FOREIGN KEY (id_referenced_table) REFERENCES ${motherTable}(id)
            ON DELETE CASCADE ON UPDATE CASCADE
         )`
         console.log(create_table)

        if(this.db_name === 'sqlite3'){
            this.conn.run(create_table,(err)=>{
                if(err) throw err
            })
        }else{
            this.conn.query(create_table,(err)=>{
                if(err) throw err
            })
        }
    }

    create(){
        (async()=>{
            var _d_list = Object.keys(this.db_instances)
            var __counter__ = parseInt(_d_list.length-1)
            var i = 0
            let autoIncrease;
            let int;
            let queryIt;
            this.db_name === 'sqlite3' ? autoIncrease = `AUTOINCREMENT` : this.db_name === 'psql' ? autoIncrease = `SERIAL` : autoIncrease = `AUTO_INCREMENT`
            this.db_name === 'sqlite3' ? int = `INTEGER` : int = `Int`
            this.db_name === 'psql' ? queryIt = `id ${autoIncrease}` : queryIt = `id ${int} ${autoIncrease}`
            var statement = `CREATE TABLE IF NOT EXISTS ${this.app_name}_${this.table_name}(${queryIt},CONSTRAINT ${this.app_name}_${this.table_name}__id PRIMARY KEY(id)`

            if(this.force){
                statement = `CREATE TABLE ${this.app_name}_${this.table_name}(${queryIt},CONSTRAINT ${this.app_name}_${this.table_name}__id PRIMARY KEY(id)`
            }

            let m2mList = []

            /*if(this.extra !== null){
                for(var f in this.extra){
                    if(this.extra[f].motherTable){
                        //init table
                        var m2mTable = `${this.app_name}_${this.table_name}__${this.app_name}_${this.extra[f].motherTable}`
                        m2mList.push([`${this.app_name}_${this.extra[f].motherTable}`,m2mTable])
                    }

                    if ( this.extra[f].primaryKey ){
                        statement += `,CONSTRAINT ${this.app_name}_${this.table_name}__${f} PRIMARY KEY(${f})`
                    }

                    let __q__ = `,${f.toString()} ${this.extra[f].value.toString()}`
                    statement += __q__
                }
                for(var f in this.db_instances){
                    if(this.db_instances[f].motherTable){
                        //init table
                        var m2mTable = `${this.app_name}_${this.table_name}__${this.app_name}_${this.db_instances[f].motherTable}`
                        m2mList.push([`${this.app_name}_${this.db_instances[f].motherTable}`,m2mTable])
                    }

                    if ( this.db_instances[f].primaryKey ){
                        statement += `,CONSTRAINT ${this.app_name}_${this.table_name}__${f} PRIMARY KEY(${f})`
                    }

                    let  __r__ = `,${f.toString()} ${this.db_instances[f].value.toString()}`;
                    statement += __r__
                }
                statement += `)`
            }else{*/
            for(var f in this.db_instances){
                if(this.db_instances[f].motherTable){
                    //init table
                    var m2mTable = `${this.app_name}_${this.table_name}__${this.app_name}_${this.db_instances[f].motherTable}`
                    m2mList.push([`${this.app_name}_${this.db_instances[f].motherTable}`,m2mTable])
                }

                if ( this.db_instances[f].primaryKey ){
                    statement += `,CONSTRAINT ${this.app_name}_${this.table_name}__${f} PRIMARY KEY(${f})`
                }

                if ( this.db_instances[f].referencedTable ){
                    var {referencedTable} = this.db_instances[f]
                    statement += `,CONSTRAINT FK_${this.app_name}_${this.table_name}__${f} FOREIGN KEY (${f}) REFERENCES ${this.app_name}_${referencedTable}(id)
                                    ON DELETE CASCADE ON UPDATE CASCADE`
                }
                console.log(f)
                let __r__ = `,${f.toString()} ${this.db_instances[f].value.toString()}`;
                statement += __r__
            }
            statement+=`)`
            //}

            console.log(statement)

            if(this.db_name === 'sqlite3'){
                this.conn.run(statement,(err)=>{
                    if(err) throw err
                    m2mList.map(itm=>this.createM2MTable(itm[0],itm[1]))
                })
            }else{
                this.conn.query(statement,(err)=>{
                    if(err) throw err
                    m2mList.map(itm=>this.createM2MTable(itm[0],itm[1]))
                })
            }
        })()
    }

    //drop table if deleted from its structure's module
    drop(){
        var droppingTable = []

        var instances  = this.db_instances
       /* var e = this.extra
        var db_i = this.db_instances

        if(this.extra){
            instances = {db_i,...e}
        }*/

        for(var n in instances){
            if(instances[n].motherTable){
                let {table} = this.knowTable(n)
                droppingTable.push(table)
            }
        }
        droppingTable.push(`${this.app_name}_${this.table_name}`)
        droppingTable.map(a=>{
            var q =`DROP TABLE IF EXISTS ${a}`
            if(this.db_name === 'sqlite3'){
                this.conn.run(q,(err)=>{
                    if(err) throw err;
                })
            }else{
                this.conn.query(q,(err,res)=>{
                    if(err) throw err
                    console.log(`${this.table_name} dropped`)
                })
            }
        })
    }

    insertM2MTable(Q){
        console.log(Q)
        for(var n in Q){
            Q[n].values.map((itm)=>{
                let id = Q[n].key[1]
                let {table} = this.knowTable(n)
                let {motherTable} = this.knowTable(n)
                var q = `INSERT INTO ${table}(id_main_table,id_referenced_table) VALUES ('${id}','${itm}')`
                var qq = `SELECT * FROM ${table} WHERE id_main_table = '${id}' AND id_referenced_table = '${itm}'`
                console.log(q)

                if(this.db_name === 'sqlite3'){
                    (async()=>{
                        let QueryReturn = await getQueryA(qq,true)
                        if (QueryReturn === undefined ) {
                            this.conn.run(q,(err)=>{
                                if(err) throw `cannot not be inserted into "${n}" column because the mother table ${motherTable} or the main table ${this.app_name}_${this.table_name} with such id does not exist`//err
                            })
                        }
                    })()
                } else {
                   (async()=>{
                        let QueryReturn = await getQueryB(qq,true)
                        if (QueryReturn === undefined ) {
                            this.conn.query(q,(err)=>{
                                if(err) throw `cannot not be inserted into "${n}" column because the mother table ${motherTable} or the main table ${this.app_name}_${this.table_name} with such id does not exist`//err
                            })
                        }
                    })()
                }
            })
        }
    }

    //myTable.insert({name:'ikechukwu',age:'10',favourite:'blue'});
    insert( _values ){
        let statement;
        let _i_i_ = 0
        let _i_counter__ = parseInt(Object.keys(_values).length-1)

        let __columns__ = `INSERT INTO ${this.app_name}_${this.table_name}(`
        let __values__ = '('
        let _v_length = Object.keys(_values).length
        let m2mList = []

        for(var f in _values){
            if(_values[f].m2m){
                    let insert_values = {}
                    insert_values[f] = _values[f]
                    m2mList.push(insert_values)
            } else {
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
                }
            }
             _i_i_++
        }
        __columns__+=')'
        __values__+=')'
        statement = `${__columns__} VALUES ${__values__}`
        console.log(statement)
        console.log(m2mList)

        if(this.db_name === 'sqlite3'){
            this.conn.run(statement,(err)=>{
                if(err) throw err
                m2mList.map(i=>this.insertM2MTable(i)) //console.log(`values inserted into table ${this.app_name}_${this.table_name}`)
            })
        }else{
            this.conn.query(statement,(err,res)=>{
                if(err) throw err
                m2mList.map(i=>this.insertM2MTable(i))
            })
        }
    }

    updateRows( __values_ ) {
        var q = `UPDATE ${this.app_name}_${this.table_name} SET`
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
        q+= ` WHERE id=${__values_.id}`

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
            let q = `${select} ${columns_} FROM ${this.app_name}_${this.table_name} `
            let where_clause = '';
            let _index = Object.keys(query).length
            let __counter_ = _index - 1
            let z = 0
            let m2mList = []
            for(var i in query){
                if(query[i].m2m){
                    let insert_values = {}
                    insert_values[i] = query[i]
                    m2mList.push(insert_values)
                } else if(_index == 1){
                    let __add__;
                    if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                        __add__ = `${i} IS NULL`
                    } else {
                        __add__ = `${i}${this.parseAll(query[i],'final')}`
                    }
                    where_clause+= __add__
                } else {
                    let __add__;
                    if(z < __counter_){
                        if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                            __add__ = `${i} IS NULL`
                        } else {
                            __add__ = `${i}${this.parseAll(query[i])}`
                        }
                        where_clause+= __add__
                    } else {
                        if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                            __add__ = `${i} IS NULL`
                        } else {
                            __add__ = `${i}${this.parseAll(query[i],'final')}`
                        }
                        where_clause+= __add__
                    }
                }
                z++
            }
            if(where_clause) q+= `WHERE ${where_clause} `;
            q+=group_
            q+=order_
            console.log(q)
            let response;
            try{
                this.db_name == 'sqlite3' ? response = await getQueryA(q,true) : response = await getQueryB(q,true)
            } catch(e) {
                console.log(`An error occurred:${e}`)
            }

            if(response !== undefined){
                var instances  = this.db_instances
                /*var e = this.extra
                var db_i = this.db_instances

                if(this.extra){
                    instances = {db_i,...e}
                }*/

                for(var n in instances){
                    if(instances[n].motherTable){
                        response[n] = JSON.parse(response[n])
                    }
                }
                if (m2mList.length !== 0) {
                    var m2mSearch = '';
                    //var a = m2mList.map(async(i,j)=>{
                    for(var i=0; i<m2mList.length; i++){
                        for(var n in m2mList[i]){
                            m2mList[i][n].values.map((k,l)=>{
                            //for(var k=0;k<m2mList[i][n].values.length;k++){
                                if( i === m2mList.length-1 && l === m2mList[i][n].values.length-1 ){
                                    m2mSearch+=`id_referenced_table='${k}'`
                                } else {
                                    m2mSearch+=`id_referenced_table='${k}' OR `
                                }
                            })
                            m2mSearch+=` AND deleted = false`
                            let {table} = this.knowTable(n)
                            var Qq = `SELECT id_main_table, id_referenced_table FROM ${table} WHERE ${m2mSearch}`
                            var m2mQueryReturn;
                            this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq) : m2mQueryReturn = await getQueryB(Qq)
                            if(otherQuery.m2mValue === undefined || otherQuery.m2mValue[n] === undefined ){
                                m2mQueryReturn.map(itm=>{
                                    if( response.id === itm.id_main_table ) {
                                        response[n].push(itm.id_referenced_table)

                                    }
                                })
                            }else{
                                var {motherTable} = this.knowTable(n)
                                //m2mQueryReturn.map(async(itm)=>{\
                                for(var k=0;k<m2mQueryReturn.length;k++){
                                    if( response.id === m2mQueryReturn[k].id_main_table ) {
                                        var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                        var returnedQuery;
                                        this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,true) : returnedQuery = await getQueryB(qq,true)
                                        response[n].push(returnedQuery)
                                    }
                                }//)
                            }
                        }
                    }//)

                    m2mList.map((i,j)=>{
                        for(var n in i){
                            if(response[n].length === 0 && !(i[n].containAll)){
                                response = null
                            } else if (i[n].containAll && response[n].length < i[n].values.length) {
                                response = null
                            }
                        }
                    })
                } else {
                    var instances  = this.db_instances
                    /*var e = this.extra
                    var db_i = this.db_instances

                    if(this.extra){
                        instances = {db_i,...e}
                    }*/

                    for(var n in instances){
                        if(instances[n].motherTable){
                            let {table} = this.knowTable(n)
                            var Qq = `SELECT id_main_table, id_referenced_table FROM ${table}`
                            var m2mQueryReturn;
                            this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq) : m2mQueryReturn = await getQueryB(Qq)
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
                                        console.log(qq)
                                        var returnedQuery;
                                        this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,true) : returnedQuery = await getQueryB(qq,true)
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
        this.updateRows(query)
    }

    //get all from db
    extract(query,otherQuery) {
        if(!otherQuery) otherQuery = {};
        var val = null; if(otherQuery.val) val = otherQuery.val;
        var order=null; if(otherQuery.order) order = otherQuery.order;
        var group=null; if(otherQuery.group) group = otherQuery.group;
        var distinct=false; if(otherQuery){if(otherQuery.distinct) distinct = otherQuery.distinct;};
        let output = (async()=>{
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
            let q = `${select} ${columns_} FROM ${this.app_name}_${this.table_name} `
            let where_clause = ''
            let _index = Object.keys(query).length
            let __counter_ = _index - 1
            var m2mList = []
            let z = 0
            var __ = Operators()
            for(var i in query){
                if(query[i].m2m){
                    let insert_values = {}
                    insert_values[i] = query[i]
                    m2mList.push(insert_values)
                } else {
                    if(_index == 1){
                        let __add__;
                        if(Array.isArray(query[i])){
                            var parseArg = __.isIn(query[i][0],query[i][1])
                            __add__ = `${i}${this.parseAll(parseArg,'final')}`
                        } else {
                            if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                                __add__ = `${i} IS NULL`
                            } else {
                                __add__ = `${i}${this.parseAll(query[i],'final')}`
                            }
                        }
                        where_clause+= __add__
                    } else {
                        let __add__;
                        if(z < __counter_){
                            if(Array.isArray(query[i])){
                                var parseArg = __.isIn(query[i][0],query[i][1])
                                __add__ = `${i}${this.parseAll(parseArg)}`
                            } else {
                                if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___'){
                                    __add__ = `${i} IS NULL`
                                } else {
                                    __add__ = `${i}${this.parseAll(query[i])}`
                                }
                            }
                            where_clause+= __add__
                        } else {
                            if(Array.isArray(query[i])){
                                var parseArg = __.isIn(query[i][0],query[i][1])
                                __add__ = `${i}${this.parseAll(parseArg,'final')}`
                            } else {
                                if(query[i] === null || query[i] == '_' || query[i] == '__' || query[i] == '___' && query[i] !== false){
                                    __add__ = `${i} IS NULL`
                                } else {
                                    __add__ = `${i}${this.parseAll(query[i],'final')}`
                                }
                            }
                            where_clause+= __add__
                        }
                    }
                }
                z++
            }
            if(where_clause) q+=`WHERE ${where_clause} `;
            q+=group_
            q+=order_
            console.log(q)
            let response;
            let itemToRemove = []
            try{
                this.db_name == 'sqlite3' ? response = await getQueryA(q) : response = await getQueryB(q)
            } catch(e) {
                console.log(`An error occurred:${e}`)
            }

            if(response !== undefined){
                var instances  = this.db_instances
                /*var e = this.extra
                var db_i = this.db_instances

                if(this.extra){
                    instances = {db_i,...e}
                }*/

                for(var n in instances){
                    if(instances[n].motherTable){
                        response.map(itm=>{
                            itm[n] = JSON.parse(itm[n])
                        })
                    }
                }
                if(m2mList.length !== 0){
                    var m2mSearch = '';
                    //var a = m2mList.map(async(i,j)=>{
                    for(var i=0; i<m2mList.length; i++){
                        for(var n in m2mList[i]){
                            m2mList[i][n].values.map((k,l)=>{
                            //for(var k=0;k<m2mList[i][n].values.length;k++){
                                if( i === m2mList.length-1 && l === m2mList[i][n].values.length-1 ){
                                    m2mSearch+=`id_referenced_table='${k}'`
                                } else {
                                    m2mSearch+=`id_referenced_table='${k}' OR `
                                }
                            })
                            m2mSearch+=` AND deleted = false`
                            let {table} = this.knowTable(n)
                            var Qq = `SELECT id_main_table, id_referenced_table FROM ${table} WHERE ${m2mSearch}`
                            var m2mQueryReturn;
                            this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq) : m2mQueryReturn = await getQueryB(Qq)
                            if(otherQuery.m2mValue[n] === undefined ){
                                response.map(itm=>{
                                    m2mQueryReturn.map(items=>{
                                        if( itm.id === items.id_main_table ) {
                                            itm[n].push(items.id_referenced_table)

                                        }
                                    })
                                })
                            }else{
                                var {motherTable} = this.knowTable(n)
                                //m2mQueryReturn.map(async(itm)=>{\
                                //response.map(itm=>{
                                for(var m=0;m<response.length;m++){
                                    for(var k=0;k<m2mQueryReturn.length;k++){
                                        if( response[m].id === m2mQueryReturn[k].id_main_table ) {
                                            var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                            var returnedQuery;
                                            this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,true) : returnedQuery = await getQueryB(qq,true)
                                            response[m][n].push(returnedQuery)
                                        }
                                    }//)
                                }
                            }
                        }
                    }//)
                    m2mList.map((i,j)=>{
                        for(var n in i){
                            response.map((itm,inx)=>{
                                if(itm[n].length === 0 && !(i[n].containAll)){
                                    itemToRemove.push(itm)
                                } else if (i[n].containAll && itm[n].length < i[n].values.length) {
                                    itemToRemove.push(itm)
                                }
                            })
                        }
                    })
                } else {
                    var instances  = this.db_instances
                    /*var e = this.extra
                    var db_i = this.db_instances

                    if(this.extra){
                        instances = {db_i,...e}
                    }*/

                    for(var n in instances){
                        if(instances[n].motherTable){
                            let {table} = this.knowTable(n)
                            var Qq = `SELECT id_main_table, id_referenced_table FROM ${table}`
                            var m2mQueryReturn;
                            this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq) : m2mQueryReturn = await getQueryB(Qq)

                            //if( !otherQuery){
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
                                //m2mQueryReturn.map(async(itm)=>{\
                                //response.map(itm=>{
                                for(var m=0;m<response.length;m++){
                                    for(var k=0;k<m2mQueryReturn.length;k++){
                                        if( response[m].id === m2mQueryReturn[k].id_main_table ) {
                                            var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                            console.log(qq)
                                            var returnedQuery;
                                            this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,true) : returnedQuery = await getQueryB(qq,true)
                                            response[m][n].push(returnedQuery)
                                        }
                                    }//)
                                }
                            }
                            /*response.map(itm=>{
                                m2mQueryReturn.map(items=>{
                                    if( itm.id === items.id_main_table ) {
                                        itm[n].push(items.id_referenced_table)

                                    }
                                })
                            })*/
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
            let a = `${select} ${columns_} FROM ${this.app_name}_${this.table_name}`
            a+=group_
            a+=order_
            let response;
            try{
                this.db_name == 'sqlite3' ? response = await getQueryA(a) : response = await getQueryB(a)
            } catch(e) {
                console.log(`An error occurred:${e}`)
            }

            var instances  = this.db_instances
            /*var e = this.extra
            var db_i = this.db_instances

            if(this.extra){
                instances = {db_i,...e}
            }*/

            for(var n in instances){
                if(instances[n].motherTable){
                    response.map(itm=>{
                        itm[n] = JSON.parse(itm[n])
                    })
                }
            }

            for(var n in instances){
                if(instances[n].motherTable){
                    let {table} = this.knowTable(n)
                    var Qq = `SELECT id_main_table, id_referenced_table FROM ${table}`
                    var m2mQueryReturn;
                    this.db_name == 'sqlite3' ? m2mQueryReturn = await getQueryA(Qq) : m2mQueryReturn = await getQueryB(Qq)
                    //if( !otherQuery){
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
                        //m2mQueryReturn.map(async(itm)=>{\
                        //response.map(itm=>{
                        for(var m=0;m<response.length;m++){
                            for(var k=0;k<m2mQueryReturn.length;k++){
                                if( response[m].id === m2mQueryReturn[k].id_main_table ) {
                                    var qq = `SELECT ${otherQuery.m2mValue[n]} FROM ${motherTable} WHERE id='${m2mQueryReturn[k].id_referenced_table}'`
                                    console.log(qq)
                                    var returnedQuery;
                                    this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq,true) : returnedQuery = await getQueryB(qq,true)
                                    response[m][n].push(returnedQuery)
                                }
                            }//)
                        }
                    }
                    /*response.map(itm=>{
                        m2mQueryReturn.map(items=>{
                            if( itm.id === items.id_main_table ) {
                                itm[n].push(items.id_referenced_table)

                            }
                        })
                    })*/
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

        /*if(this.extra === null){
            dataTypes = {...this.db_instances}
        }else{
            dataTypes = {...this.extra,...this.db_instances}
        }*/

        /*if(this.extra != null){
            Object.keys(this.extra).map((itm)=>{
                columns.push(itm)
            })
        }*/

        Object.keys(this.db_instances).map((itm)=>{
            columns.push(itm)
        })
        let tables = {table_name:`${this.app_name}_${this.table_name}`,columns,dataTypes,force:this.force}
        console.log(tables)
        return tables
    }

    //var a = append(main,{a:[query1,query1_body]}) or append(main,{a:[query1]})
    append (m_query,a_query,join) {
        let main_query = m_query

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

        function LeftJoin(m_query,a_query,join,main_query,pop,full_join){
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
                    console.log(err)
                }
            }
            return main_query
        }

        function RightJoin(m_query,a_query,join,main_query){
            let lk,mk;
            join[n].Joiner ? mk = join[n].Joiner[0] : mk = 'id'
            join[n].Joiner ? lk = join[n].Joiner[1] : lk = 'id'
            if( Array.isArray(a_query[n]) ) {
               a_query[n].map((itm)=>{itm[n] = null})
               //var rightQuery = a_query[n]
               var main_queryMap = main_query
               main_queryMap.map(y=>{
                    var get_it = add(a_query[n],y,n,mk,lk)
                    main_query = get_it
                    /*if(z === main_query.length-1){
                        rightQuery = get_it
                        main_query = rightQuery
                        console.log(a_query[n])
                    } else {
                        rightQuery = get_it
                    }*/

                })
            } else {
                try{
                    a_query[n][n] = null
                    var get_it = add(a_query[n],main_query,n,mk,lk)
                    main_query = get_it
                } catch(err){
                    console.log(err)
                }
            }
            return main_query
        }


        function FullJoin(m_query,a_query,join,main_query,full_join){
            var pop = []
            LeftJoin(m_query,a_query,join,main_query,pop,full_join)
            pop.map(a=>{a_query[n].splice(a_query[n].indexOf(a),1)})
            console.log(a_query[n].length)
            if( Array.isArray(main_query) && a_query[n].length !== 0 ) {
                for(var k=0;k<a_query[n].length;k++){
                    var initInstance = main_query[0]
                    var instance = {}
                    for(var i in initInstance){
                        instance[i] = null
                    }
                    instance[n]=a_query[n][k]
                    var toAppend = instance
                    var index = []
                    if(main_query[main_query.length-1]['id'] > a_query[n][k]['id']){
                        console.log('i')
                        for(var h=0;h<main_query.length;h++){
                            if(main_query[h]['id'] < a_query[n][k]['id']){
                                index.push(main_query.indexOf(main_query[h]))
                            }
                        }
                    }

                    if(index.length == 0){
                        toAppend.id = toAppend[n].id
                        main_query.push(toAppend)
                    } else {
                        toAppend.id = toAppend[n].id
                        main_query.splice(index[index.length-1]+1,0,toAppend)
                    }
                }
            } else if(a_query[n] !== undefined && !Array.isArray(a_query[n]) ){
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
                        var leftJoin = LeftJoin(m_query,a_query,join,main_query)
                        main_query = leftJoin
                    } else if(join[n].Join === 'rightJoin') {
                        var rightJoin = RightJoin(m_query,a_query,join,main_query)
                        main_query = rightJoin
                    } else if(join[n].Join === 'fullJoin') {
                        var fullJoin = FullJoin(m_query,a_query,join,main_query,true)
                        main_query = fullJoin
                    } else if(join[n].Join === 'innerJoin'){
                        var innerJoin = LeftJoin(m_query,a_query,join,main_query)
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
                console.log(err)
            }
        }
        return main_query
    }

    m2mD(values,force){

    }

    m2mA(id,values){
        let {table} = this.knowTable(values[0])
        values[1].map(a=>{
            let q = `INSERT INTO ${table} (id_main_table,id_referenced_table) VALUES (`
            let qq = `SELECT * FROM ${table} WHERE `
            q+=`${id},${a})`
            qq+=`id_main_table='${id}' AND id_referenced_table='${a}'`
            if(this.db_name === 'sqlite3'){
                (async()=>{
                    let QueryReturn = await getQueryA(qq,true)
                    if (QueryReturn === undefined ) {
                        this.conn.run(q,(err)=>{
                            if(err) throw err
                        })
                    }
                    console.log(QueryReturn)
                })()
            } else {
               (async()=>{
                    let QueryReturn = await getQueryB(qq,true)
                    if (QueryReturn === undefined ) {
                        this.conn.query(q,(err)=>{
                            if(err) throw err
                        })
                    }
                    console.log(QueryReturn)
                })()
            }
        })
    }


    m2mD(id,values){
        let {table} = this.knowTable(values[0])
        values[1].map(a=>{
            let q = `DELETE FROM ${table} WHERE `
            let qq = `SELECT * FROM ${table} WHERE `
            q+=`id_main_table='${id}' AND id_referenced_table='${a}'`
            qq+=`id_main_table='${id}' AND id_referenced_table='${a}'`
            if(this.db_name === 'sqlite3'){
                (async()=>{
                    let QueryReturn = await getQueryA(qq,true)
                    if (QueryReturn) {
                        this.conn.run(q,(err)=>{
                            if(err) throw err
                        })
                    }
                    console.log(QueryReturn)
                })()
            } else {
               (async()=>{
                    let QueryReturn = await getQueryB(qq,true)
                    console.log(q)
                    if (QueryReturn) {
                        this.conn.query(q,(err)=>{
                            if(err) throw err
                        })
                    }
                    console.log(QueryReturn)
                })()
            }
        })
    }

    getM2MChild(a,arg){
        var output = (async()=>{
            var {Table} = arg
            var {Query} = arg
            var {QuerySupplement} = arg
            var pointer = a.id
            var table = `${this.app_name}_${Table.table_name}__${this.app_name}_${this.table_name}`
            var qq = `SELECT * FROM ${table} WHERE id_referenced_table='${pointer}'`
            var returnedQuery;
            this.db_name == 'sqlite3' ? returnedQuery = await getQueryA(qq) : returnedQuery = await getQueryB(qq)

            let m2m = [];
            returnedQuery.map(itm=> m2m.push(itm.id_main_table))
            !Query ?  Query = {} : null
            Query['id'] = []
            Query['id'].push(m2m)

            var response = await Table.extract(Query,QuerySupplement)
            //console.log(response)
            return response
        })()
        return output
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

        argF.Null ? qNull = '' : qNull = 'NOT NULL'
        argF.primaryKey ? primaryKey = true : primaryKey = false

        if(arg.Width){
            argF.width ? qWidth = `${argF.width}` : qWidth = ''
        }
        if(arg.Update){
            argF.onUpdate ? qUpdate = `ON UPDATE CASCADE` : qUpdate = ''
        }
        if(arg.Delete){
            argF.onDelete ? qDelete = `ON DELETE CASCADE` : qDelete = ''
        }
        if(arg.Decimal_Places){
            argF.decimal_places ? qDecimal_place = `,${argF.decimal_places}` : qDecimal_place = ''
        }

        if(arg.DefaultValue){
            argF.defaultValue ? qDefaultValue = `DEFAULT '${argF.defaultValue}'` : qDefaultValue = ''
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

        return {value:`${arg.name}${bracket} ${qDefaultValue} ${qUpdate} ${qDelete} ${qNull}`,primaryKey}
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

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : qUnique = false
        }

        return {value:`BigInt${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
    }

    qBit( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = '';

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Bit${qwidth} ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qJson(arg) {
        return {value:this.qVarchar({width:l}),json:through}
    }

    qSmallInt( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`SmallInt${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
    }

    qDecimal( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = '';
        var qWidth = 10;
        var qDecimalPlace = 2;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.width ? qWidth = arg.width : qWidth = 10
            arg.decimal_places ? qDecimalPlace = arg.decimal_places : qDecimalPlace = 2
        }

        return {value:`Decimal(${qWidth},${decimal_places}) ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qSmallMoney( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`SmallMoney ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qInt( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = '';

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        let output;
        if(db_connection.db_name === 'sqlite3'){
            output = {value:`Integer ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
        } else {
            output = {value:`Int${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
        }

        return output
    }

    qTinyInt( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var qUnique = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`TinyInt${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
    }

    qMoney( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = '';

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Money ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qFloat( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = 10;
        var qDecimalPlace = 2;
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
            arg.width ? qWidth = arg.width : qWidth = 10
            arg.decimal_places ? qDecimalPlace = arg.decimal_places : qDecimalPlace = 2
        }

        return {value:`Float(${qWidth},${qDecimalPlace}) ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qDate( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Date ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qDatetime( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = '';

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`DateTime ${qDefaultValue} ${qNull} ON UPDATE CASCADE`,primaryKey}
    }

    qSmallDatetime( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`SmallDateTime ${qDefaultValue} ${qNull} ON UPDATE CASCADE`,primaryKey}
    }

    qTime( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = '';

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Time ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qChar( arg ) {
        var qNull;
        var qDefaultValue;
        var qWidth;
        var primaryKey;

        if(!arg) throw 'Please make sure you define the width'

        if(arg){
            if(!arg.width) throw 'Please make sure you define the width !!!'
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Char${qWidth} ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qVarchar(arg) {
        var qNull
        var qDefaultValue;
        var qWidth;
        var qUnique;
        var primaryKey;

        if(!arg) throw 'Please make sure you define the width !!!'

        if(arg){
            if(!arg.width) throw 'Please make sure you define the width !!!'
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Varchar${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
    }

    qText( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Text ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
    }

    qNChar( arg ) {
        var qNull;
        var qDefaultValue;
        var qWidth;
        var qUnique;
        var primaryKey;

        if(!arg) throw 'Please make sure you define the width'

        if(arg){
            if(!arg.width) throw 'Please make sure you define the width'
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = true
        }

        return {value:`NChar ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
    }

    qNVarchar( arg ) {
        var qNull;
        var qDefaultValue;
        var qWidth;
        var qUnique;
        var primaryKey;

        if(!arg.width) throw 'Please make sure you define the width'

        if(arg){
            if(!arg.width) throw 'Please make sure you define the width'
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`NVarchar${qWidth} ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
    }

    qNText( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qUnique = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.unique ? qUnique = `UNIQUE` : qUnique = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`NText ${qDefaultValue} ${qUnique} ${qNull}`,primaryKey}
    }

    qBinary( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Binary${qWidth} ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qVarBinary( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var qWidth = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.width ? qWidth = `(${arg.width})` : qWidth = ''
            arg.primaryKey ? primaryKey = true: primaryKey = false
        }

        return {value:`VarBinary${qWidth} ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qImage( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Image ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qBoolean( arg ) {
        var qNull = '';
        var qDefaultValue = '';
        var primaryKey = false;

        if(arg){
            arg.Null ? qNull = '' : qNull = 'NOT NULL'
            arg.defaultValue ? qDefaultValue = `DEFAULT '${arg.defaultValue}'` : qDefaultValue = ''
            arg.primaryKey ? primaryKey = true : primaryKey = false
        }

        return {value:`Boolean ${qDefaultValue} ${qNull}`,primaryKey}
    }

    qForeignKey(referencedTable){
        var {value} = this.qInt()
        return {value,referencedTable}
    }

    qM2MKey(motherTable){
        var dValue = JSON.stringify([])
        var {value}  = this.qVarchar({width:10,defaultValue:dValue})
        return {value,motherTable}
    }
}



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
    male: true,
    id:3,
    name: 'ikechukwu',
    love: 'yes',
    age: 10
  },
  {
    favourite: 'blue',
    male: true,
    id:4,
    name: 'solisoma',
    love: 'no',
    age: 19
  },
  {
    favourite: 'blue',
    male: true,
    id:3,
    name: 'alolisoma',
    love: 'no',
    age: 19
  },
  { favourite: 'red', id:3, male: false, name: null, love: 'yes', age: 19 }
]


var __ = new DataType()
var e = {favourite:Operators().isIn(['blue']),male:true}
var myTable2 = new QuickTable('SOLI',{name:__.qVarchar({width:100}),age:__.qInt()})
var myTable = new QuickTable('MADZ',{name:__.qVarchar({Null:false,unique:true,width:100}),soli:__.qM2MKey('SOLI'),age:__.qInt()})
var myTable3 = new QuickTable('Capacity', {age:__.qInt(),height:__.qInt(),muscleSize:__.qVarchar({width:10}), madz:__.qForeignKey('SOLI')})
//myTable.insert({name:'cs',soli:Operators().m2mI([2],['id',2]),age:'20'});
//myTable2.insert({name:'ie',age:'20'});
//myTable3.insert({muscleSize:'very big',madz:4,height:22,age:25})
var c = (async()=>{
    let response2 = await myTable.extract({id:[[2,4]]},{m2mValue:{soli:'*'}})
    //let key = response2[response2.length-1].id+1
    //myTable.insert({name:'nw',soli:Operators().m2mI([2],['id',key]),age:'20'});
    //myTable2.insert({name:'ike',age:'20'});
    let response = await myTable2.find({id:1})
    let response3 = await myTable3.extract({id:[[3,4]]})
    //let appendData = myTable.append(response3,{love:m/*,passion:response*/},{love:{Join:'leftJoin'}/*,passion:{Joiner:['id','madz'],Join:'innerJoin'}*/})
    //myTable.m2mA(response2[0].id,['soli',[2]])
    //myTable.m2mD(response2[0].id,['soli',[2]])
    //console.log(response2[0])
    //console.log(response)
    //console.log(response3)
    var s = await myTable2.getM2MChild(response,{
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
    console.log(s[0].soli)
})()
//myTable2.create()
//myTable.create()
//myTable3.create()
/*var t = initDataType({name:'MADZWORLD',Width:true,Update:true,Delete:true,DefaultValue:true, Decimal_Places:true})
var d = t.field({Null:true,defaultValue:'soli',onUpdate:true,onDelete:true,width:10,primaryKey:false, decimal_places:10})
console.log(d)*/

module.exports = {QuickTable,Operators:Operators(),DataType:new DataType(),initDataType}