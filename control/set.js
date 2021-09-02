const fs = require('fs')
let {structures,db_connection} = require(`${process.cwd()}/QT_FOLDER/settings.js`)
let RootDirectory = `${process.cwd()}/QT_FOLDER/ToDeployFiles`
let Drop = []
let Create = []
let New_Column = []
let Update_Column = []
let Update_SqliteColumn = []
let Drop_Column = []
let Rename_Column = []
let checkDrop = []
let AllStructures = {}
let Update_structure_tracker = {}
var FILE = fs.readdirSync(RootDirectory)

function handleColumn(tableDetails,tables,a,i){
    var result ={}
    if(tableDetails.dataTypes[a].qNull || tables[i].dataTypes[a].qNull){
        var NULL = 'NO'
        if(tableDetails.dataTypes[a].qNull && !(tables[i].dataTypes[a].qNull)) NULL = 'YES';
        if(tableDetails.dataTypes[a].qNull && tables[i].dataTypes[a].qNull) NULL = 'NEUTRAL'
        result['NULL'] = NULL
    }
    if(tableDetails.dataTypes[a].qDefaultValue || tables[i].dataTypes[a].qDefaultValue){
        var DefaultValue = 'NO'
        if(tableDetails.dataTypes[a].qDefaultValue && !(tables[i].dataTypes[a].qDefaultValue)) DefaultValue = 'YES';
        if(tableDetails.dataTypes[a].qDefaultValue && tables[i].dataTypes[a].qDefaultValue) DefaultValue = 'NEUTRAL'
        result['DefaultValue'] = DefaultValue
    }
    if(tableDetails.dataTypes[a].qWidth || tables[i].dataTypes[a].qWidth){
        var Width = 'NO'
        if(tableDetails.dataTypes[a].qWidth && !(tables[i].dataTypes[a].qWidth)) Width = 'YES';
        if(tableDetails.dataTypes[a].qWidth === tables[i].dataTypes[a].qWidth) Width = 'NEUTRAL'
        if(tableDetails.dataTypes[a].qWidth !== tables[i].dataTypes[a].qWidth) Width = 'YES'
        result['Width'] = Width
    }
    if(tableDetails.dataTypes[a].qUnique || tables[i].dataTypes[a].qUnique){
        var Unique = 'NO'
        if(tableDetails.dataTypes[a].qUnique && !(tables[i].dataTypes[a].qUnique)) Unique = 'YES';
        if(tableDetails.dataTypes[a].qUnique && tables[i].dataTypes[a].qUnique) Unique = 'NEUTRAL'
        result['Unique'] = Unique
    }
    if(tableDetails.dataTypes[a].qDecimalPlace || tables[i].dataTypes[a].qDecimalPlace){
        var DecimalPlace = 'NO'
        if(tableDetails.dataTypes[a].qDecimalPlace && !(tables[i].dataTypes[a].qDecimalPlace)) DecimalPlace = 'YES';
        if(tableDetails.dataTypes[a].qDecimalPlace && tables[i].dataTypes[a].qDecimalPlace) DecimalPlace = 'NEUTRAL'
        result['DecimalPlace'] = DecimalPlace
    }

    var DataType = 'NEUTRAL'
    if(tableDetails.dataTypes[a].dataType !== tables[i].dataTypes[a].dataType) DataType = 'YES';
    result['DataType'] = DataType


    return result
}
var Command;

/*function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}*/

if(FILE.length === 0){

    structures.map(itm=>{
        const files = require(`${process.cwd()}/${itm}`)
        const toUpdateAllStructures = {...AllStructures,...files}
        AllStructures = toUpdateAllStructures
        for(var i in files){
            Update_structure_tracker[i] = files[i].collect()
            Create.push(i)
            console.log(`Creating Table "${i}"`)
            
        }
    })

    Command = {
            Drop,
            Create,
            New_Column,
            Update_Column,
            Update_SqliteColumn,
            Drop_Column,
            Rename_Column
    }
} else {
    const {tables} = require(`${RootDirectory}/${FILE[FILE.length-1]}`)
    structures.map(itm=>{
        const files = require(`${process.cwd()}/${itm}`)
        const toUpdateAllStructures = {...AllStructures,...files}
        AllStructures = toUpdateAllStructures
        for(var i in files){
            Update_structure_tracker[i] = files[i].collect()
            //console.log(files)
            const tableDetails = files[i].collect()
            //console.log(tableDetails.dataTypes['madz'])
            let stopFlag = false
            if(stopFlag === false && tables[i] === undefined || files[i].force){
                Create.push(i)
                console.log(`Creating Table "${i}"`)
                stopFlag = true
                
            }

            tableDetails.columns.map(a=>{
                if(stopFlag === false && !(tables[i].columns.includes(a)) && !(tableDetails.dataTypes[a].rename[0])){
                    const New_Column_Detail = {Table:i,columnHead:a,columnBody:tableDetails.dataTypes[a]}
                    New_Column.push(New_Column_Detail)
                    console.log(`Adding New Column "${a}" in Table "${i}"`)
                    
                }

                if(stopFlag === false && !(tables[i].columns.includes(a)) && tableDetails.dataTypes[a].rename[0]){
                    // console.log(iH)
                    var iH = tableDetails.dataTypes[a].rename[1]
                    const Rename_Column_Detail = {Table:i,columnHead:a,initialHead:iH}
                    Rename_Column.push(Rename_Column_Detail)
                    checkDrop.push(tableDetails.dataTypes[a].rename[1])
                    console.log(`Renaming Column "${iH}" to "${a}" in Table "${i}"`)
                    
                }

                if(stopFlag === false && tables[i].columns.includes(a) && JSON.stringify(tables[i].dataTypes[a]) !== JSON.stringify(tableDetails.dataTypes[a]) && !(tableDetails.dataTypes[a].rename[0])){
                    if(db_connection.db_name !== 'sqlite3'){
                        var PK = 'NO', FK = 'NO', m2m = 'NO'
                        if(tableDetails.dataTypes[a].referencedTable && !(tables[i].dataTypes[a].referencedTable)) FK = 'YES';
                        if(tableDetails.dataTypes[a].primaryKey && !(tables[i].dataTypes[a].primaryKey)) PK = 'YES';
                        if(tableDetails.dataTypes[a].motherTable && !(tables[i].dataTypes[a].motherTable)) m2m = 'YES';

                        if(tableDetails.dataTypes[a].referencedTable && tables[i].dataTypes[a].referencedTable) FK = 'NEUTRAL';
                        if(tableDetails.dataTypes[a].primaryKey && tables[i].dataTypes[a].primaryKey) PK = 'NEUTRAL';
                        if(tableDetails.dataTypes[a].motherTable && tables[i].dataTypes[a].motherTable) m2m = 'NEUTRAL';

                        if(!tableDetails.dataTypes[a].referencedTable && !tables[i].dataTypes[a].referencedTable) FK = 'NEUTRAL';
                        if(!tableDetails.dataTypes[a].primaryKey && !tables[i].dataTypes[a].primaryKey) PK = 'NEUTRAL';
                        if(!tableDetails.dataTypes[a].motherTable && !tables[i].dataTypes[a].motherTable) m2m = 'NEUTRAL';
                        
                        var inputColumn = handleColumn(tableDetails,tables,a,i)
                        const Update_Column_Detail = {Table:i,/*DT:tables[i].dataTypes,*/columnHead:a,columnBody:{...tableDetails.dataTypes[a],PK,FK,m2m,...inputColumn}}
                        Update_Column.push(Update_Column_Detail)
                        console.log(Update_Column)
                        console.log(`Updating Column "${a}" in Table "${i}"`)

                    } else if(db_connection.db_name == 'sqlite3'){
                        var m2m = false ;
                        if(tableDetails.dataTypes[a].motherTable) m2m=true;
                        const Drop_Column_Details = {Table:i,column:a,m2m}
                        const New_Column_Details = {Table:i,columnHead:a,columnBody:tableDetails.dataTypes[a]}
                        Update_SqliteColumn.push([Drop_Column_Details,New_Column_Details])
                        console.log(`Updating Column "${a}" in Table "${i}"`)
                    }
                }
            })
        }
    })
    for(var i in tables){
        var stopFlag = false
        if(stopFlag === false && AllStructures[i] === undefined){
            Drop.push({instances:tables[i].dataTypes,table:tables[i].table_name,appName:tables[i].app_name})
            console.log(`Dropping Table "${i}"`)
            stopFlag = true
            
        }
        //console.log(AllStructures[i])

        tables[i].columns.map(itm=>{
            if(AllStructures[i] !== undefined){
                const getCol = AllStructures[i].collect()
                if(stopFlag === false && AllStructures[i] !== undefined && !(checkDrop.includes(itm)) && !(getCol.columns.includes(itm)) && !(Create.includes(AllStructures[i]))){
                    var m2m = false
                    // console.log(tables[i].dataTypes[itm])
                    if(tables[i].dataTypes[itm].motherTable) m2m=true;
                    const Drop_Column_Detail = {Table:i,column:itm,m2m}
                    Drop_Column.push(Drop_Column_Detail)
                    console.log(`Dropping Column "${itm}" in Table "${i}"`)
                    
                }
            }
        })
    }

    Command = {
        Drop,
        Create,
        New_Column,
        Update_Column,
        Update_SqliteColumn,
        Drop_Column,
        Rename_Column
    }

    //console.log({Command,Update_structure_tracker})
}

var StringifyCommand = JSON.stringify(Command)

const CommandsI = {
    Drop:[],
    Create:[],
    New_Column:[],
    Update_Column:[],
    Drop_Column:[],
    Rename_Column:[]
}

if(JSON.stringify(Command) === JSON.stringify(CommandsI)){
    console.log("No changes yet\n")
} else {
        var regExp = /\d+/igm
        if(FILE.length == 0){
            fs.writeFileSync(
            `${RootDirectory}/00ToDeployFile.js`,
`const Commands = ${StringifyCommand}
const tables = ${JSON.stringify(Update_structure_tracker)}

module.exports = {Commands,tables}`
            )
        }else{
            var checkFile = FILE[FILE.length-1].match(regExp)
            var parseCheckFile = parseInt(checkFile)
            var add = parseCheckFile+1
            var output;

            if(checkFile.toString().length == 2 && add < 10){
                output = '0'+add.toString()+'ToDeployFile.js'
            }else{
                var main = add.toString()+'ToDeployFile.js'
                output = main
            }
            fs.writeFileSync(
                `${RootDirectory}/${output}`,
`const Commands = ${StringifyCommand}
const tables = ${JSON.stringify(Update_structure_tracker)}

module.exports = {Commands,tables}`
            )
            /*fs.writeFileSync(`${process.cwd()}/QT_FOLDER/structure_tracker.js`,
`//contains the tables created column and features
let tables = ${Update_structure_tracker}

module.exports = {tables:tables}`
            )*/
        }

        console.log('\nCommand completed successfully\n')

}