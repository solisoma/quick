const settings_ = require('./settings')

var init_ = require('./control/quick')
var deploy = require('./control/deploy')
var set = require('./control/set');

var init = init_()
var connection  = ['psql',{
    host:'localhost',
    user:'postgres',
    password:'ikechukwu',
    database:'postgres'
}] 
var structures = ['./mytables.js']
var app_name = 'xatisfy'
var settings = settings_({structures,connection,app_name})

deploy({settings,init})
// set({settings,init})