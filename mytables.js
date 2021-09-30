var {QuickTable,__} = require('./structure.js')

//var e = {favourite:Operators().isIn(['blue']),male:true}
const settings_ = require('./settings')
var connection  = ['psql',{
    host:'localhost',
    user:'postgres',
    password:'ikechukwu',
    database:'postgres'
}] 
var structures = ['./mytables.js']
var app_name = 'xatisfy'
var settings = settings_({structures,connection,app_name})

var myTable2 = new QuickTable('SOLI',{name:__.qVarchar({width:100}),LOVE:__.qVarchar({width:100,defaultValue:'yes',rename:[true,"Age"]})},settings)
// var myTable4 = new QuickTable('MADZ_old',{name:__.qVarchar({width:100}),age:__.qInt()})
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

module.exports = {myTable2/*,myTable,myTable3*/}