//to argument = {settings,init}
function set(constraints){
    const fs = require('fs')
    // const path = require('path')
    //const { Commands } = require('../QT_FOLDER/ToDeployFiles/16ToDeployFile')
    let {structures,db_connection} = constraints.settings
    let RootDirectory = constraints.init

    let Drop = []
    let Create = []
    let New_Column = []
    let Update_Column = []
    let Update_SqliteColumn = []
    let Drop_Column = []
    let Rename_Column = []
    let ChangeTableName = []
    let checkDrop = []
    let AllStructures = {} //To get all tables as a dict for easy manipulation and knowing which table to drop 
    let Update_structure_tracker = {}
    var FILE = fs.readdirSync(`${RootDirectory}/QT_FOLDER/ToDeployFiles`)

    function handleColumn(tableDetails,tables,a,i){
        var result ={}
        if(tableDetails.dataTypes[a].qNull || tables[i].dataTypes[a].qNull){
            var NOTNULL = 'NO'
            if(tableDetails.dataTypes[a].qNull && !(tables[i].dataTypes[a].qNull)) NOTNULL = 'YES';
            if(tableDetails.dataTypes[a].qNull && tables[i].dataTypes[a].qNull) NOTNULL = 'NEUTRAL'
            result['NOTNULL'] = NOTNULL
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
            const files = require(`${RootDirectory}/${itm}`)
            const toUpdateAllStructures = {...AllStructures,...files}
            AllStructures = toUpdateAllStructures
            for(var i in files){
                Update_structure_tracker[i] = files[i].collect()
                Create.push(i)
                console.log(`\nCreating Table "${i}"`)
                
            }
        })

        Command = {
                Drop,
                Create,
                New_Column,
                Update_Column,
                Update_SqliteColumn,
                Drop_Column,
                Rename_Column,
                ChangeTableName
        }
    } else {
        const {tables} = require(`${RootDirectory}/QT_FOLDER/ToDeployFiles/${FILE[FILE.length-1]}`)
        structures.map(itm=>{
            const files = require(`${RootDirectory}/${itm}`)
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
                    console.log(`\nCreating Table "${i}"`)
                    stopFlag = true
                    
                }

                if(stopFlag === false && tables[i].table_name !== tableDetails.table_name){
                    const New_TableName = {Table:i, old_name:tables[i].table_name, new_name:tableDetails.table_name}
                    ChangeTableName.push(New_TableName)
                    console.log(`\nChanging Table name from "${tables[i].table_name}" to "${tableDetails.table_name}" in "${i}"`)
                    
                }

                tableDetails.columns.map(a=>{
                    if(stopFlag === false && !(tables[i].columns.includes(a)) && !(tableDetails.dataTypes[a].rename[0])){
                        const New_Column_Detail = {Table:i,columnHead:a,columnBody:tableDetails.dataTypes[a]}
                        New_Column.push(New_Column_Detail)
                        console.log(`\nAdding New Column "${a}" in "${i}"`)
                        
                    }

                    if(stopFlag === false && !(tables[i].columns.includes(a)) && tableDetails.dataTypes[a].rename[0]){
                        // console.log(iH)
                        var iH = tableDetails.dataTypes[a].rename[1]
                        const Rename_Column_Detail = {Table:i,columnHead:a,initialHead:iH}
                        Rename_Column.push(Rename_Column_Detail)
                        checkDrop.push(tableDetails.dataTypes[a].rename[1])
                        console.log(`\nRenaming Column "${iH}" to "${a}" in "${i}"`)
                        
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
                            // console.log(Update_Column)
                            console.log(`\nUpdating Column "${a}" in "${i}"`)

                        } else if(db_connection.db_name == 'sqlite3'){
                            var m2m = false ;
                            if(tableDetails.dataTypes[a].motherTable) m2m=true;
                            const Drop_Column_Details = {Table:i,column:a,m2m}
                            const New_Column_Details = {Table:i,columnHead:a,columnBody:tableDetails.dataTypes[a]}
                            Update_SqliteColumn.push([Drop_Column_Details,New_Column_Details])
                            console.log(`\nUpdating Column "${a}" in "${i}"`)
                        }
                    }
                })
            }
        })
        for(var i in tables){
            var stopFlag = false
            if(stopFlag === false && AllStructures[i] === undefined){
                Drop.push({instances:tables[i].dataTypes,table:tables[i].table_name,appName:tables[i].app_name})
                console.log(`\nDropping Table "${i}"`)
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
                        console.log(`\nDropping Column "${itm}" in "${i}"`)
                        
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
            Rename_Column,
            ChangeTableName
        }

        //console.log({Command,Update_structure_tracker})
    }

    var writetoDeployFileCommands = '\n'
    for(var i in Command){
        var list = '\n'
        Command[i].map(u=>{
            list += `\t\t${JSON.stringify(u)},\n`
        })
        var listCover;

        if(Command[i].length == 0){
            listCover = `[]`
        } else {
            listCover = `[`+
                            `${list}`+
                        `\t]`
        }
        
        writetoDeployFileCommands += `\t${i}:${listCover},\n`
    }

    var writetoDeployFileTables = '\n'
    for(var i in Update_structure_tracker){
        var keys = '\n'
        for(var k in Update_structure_tracker[i]){
            keys += `\t\t${k}:${JSON.stringify(Update_structure_tracker[i][k])},\n`
        }
        var keyCover = `{`+
                        `${keys}`+
                    `\t}`
        writetoDeployFileTables += `\t${i}:${keyCover},\n`
    }

    const CommandsI = {
        Drop:[],
        Create:[],
        New_Column:[],
        Update_Column:[],
        Update_SqliteColumn:[],
        Drop_Column:[],
        Rename_Column:[],
        ChangeTableName:[]
    }

    if(JSON.stringify(Command) === JSON.stringify(CommandsI)){
        console.log("\nNo changes in you tables yet\n")
    } else {
            var regExp = /\d+/igm
            if(FILE.length == 0){
                fs.writeFileSync(
                    `${RootDirectory}/QT_FOLDER/ToDeployFiles/00ToDeployFile.js`,
                    `const Commands = {`+
                        `${writetoDeployFileCommands}`+
                    `}\n\n`+
                    `const tables = {`+
                        `${writetoDeployFileTables}`+
                    `}\n\n`+
                    `module.exports = {Commands,tables}`
                )
            }else{
                var checkFile = FILE[FILE.length-1].match(regExp)
                var parseCheckFile = parseInt(checkFile)
                var add = parseCheckFile+1
                var output;

                if(checkFile.toString().length == 2 && add < 10){
                    var main = '0'+add.toString()+'ToDeployFile.js'
                    output = main
                }else{
                    var main = add.toString()+'ToDeployFile.js'
                    output = main
                }

                fs.writeFileSync(
                    `${RootDirectory}/QT_FOLDER/ToDeployFiles/${output}`,
                    `const Commands = {`+
                        `${writetoDeployFileCommands}`+
                    `}\n\n`+
                    `const tables = {`+
                        `${writetoDeployFileTables}`+
                    `}\n\n`+
                    `module.exports = {Commands,tables}`
                )
                /*fs.writeFileSync(`${process.cwd()}/QT_FOLDER/structure_tracker.js`,
    `//contains the tables created column and features
    let tables = ${Update_structure_tracker}

    module.exports = {tables:tables}`
                )*/
            }

            console.log('\nCommand completed successfully\n')

    }
}

module.exports = set