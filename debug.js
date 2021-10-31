// const settings_ = require('./settings')
var {Ops} = require('./structure.js')
var {myTable2} = require('./mytables')

// var init_ = require('./control/quick')
// var deploy = require('./control/deploy')
// var set = require('./control/set');

// var init = init_()
// var connection  = ['psql',{
//     host:'localhost',
//     user:'postgres',
//     password:'ikechukwu',
//     database:'postgres'
// }] 
// var structures = ['./mytables.js']
// var app_name = 'xatisfy'
// var settings = settings_({structures,connection,app_name})
var Func = async()=>{
    await myTable2.find({ name : Ops.contains('solisoma')})
}
Func()

// deploy({settings,init})
// set({settings,init})

