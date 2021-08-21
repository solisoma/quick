const fs = require('fs')
let {structures} = require(`${process.cwd()}/QT_FOLDER/settings.js`)
let RootDirectory = `${process.cwd()}/QT_FOLDER/ToDeployFiles`
let Drop = []
let Create = []
let New_Column = []
let Update_Column = []
let Drop_Column = []
let AllStructures = {}
let Update_structure_tracker = {}
var FILE = fs.readdirSync(RootDirectory)

var Command;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


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
            Drop_Column
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
                if(stopFlag === false && !(tables[i].columns.includes(a))){
                    const New_Column_Detail = {Table:i,columnHead:a,columnBody:tableDetails.dataTypes[a]}
                    New_Column.push(New_Column_Detail)
                    console.log(`Adding New Column "${a}" in Table "${i}"`)
                    
                }
                if(stopFlag === false && tables[i].columns.includes(a) && JSON.stringify(tables[i].dataTypes[a]) !== JSON.stringify(tableDetails.dataTypes[a])){
                    const Update_Column_Detail = {Table:i,columnHead:a,columnBody:tableDetails.dataTypes[a]}
                    Update_Column.push(Update_Column_Detail)
                    console.log(`Updating Column "${a}" in Table "${i}"`)
                    
                }
            })
        }
    })
    for(var i in tables){
        var stopFlag = false
        if(stopFlag === false && AllStructures[i] === undefined){
            Drop.push(i)
            console.log(`Dropping Table "${i}"`)
            stopFlag = true
            
        }
        //console.log(AllStructures[i])

        tables[i].columns.map(itm=>{
            if(AllStructures[i] !== undefined){
                const getCol = AllStructures[i].collect()
                //console.log(getCol)
                if(stopFlag === false && AllStructures[i] !== undefined && !(getCol.columns.includes(itm)) && !(Create.includes(AllStructures[i]))){
                    const Drop_Column_Detail = {Table:i,column:itm}
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
        Drop_Column
    }

    //console.log({Command,Update_structure_tracker})
}

var StringifyCommand = JSON.stringify(Command)

const CommandsI = {
    Drop:[],
    Create:[],
    New_Column:[],
    Update_Column:[],
    Drop_Column:[]
}

if(JSON.stringify(Command) === JSON.stringify(CommandsI)){
    console.log("No changes yet\n")
} else {
        var regExp = /\d+/igm
        if(FILE.length == 0){
            fs.writeFileSync(
            `${RootDirectory}/00migration.js`,
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
                output = '0'+add.toString()+'migration.js'
            }else{
                var main = add.toString()+'migration.js'
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