var {QuickTable,__} = require('./structure.js')

var myTable2 = new QuickTable('SOLI',{
        name:__.qVarchar({width:100}),
        age:__.qInt()
    })

var myTable = new QuickTable('MADZ',{
        name:__.qVarchar({
            Null:false,
            unique:true,
            width:100
        }),
        soli:__.qM2MKey('SOLI'),
        ace:__.qInt(),
        great:__.qJson()
    })

var myTable3 = new QuickTable('Capacity', {
        ike:__.qJson(),
        height:__.qInt(),
        muscleSize:__.qVarchar({
            width:10,
            primaryKey:true
        }),
        madz:__.qForeignKey('SOLI'),
        age:__.qVarchar({width:10})
    })

// module.exports = {myTable2,myTable,myTable3}