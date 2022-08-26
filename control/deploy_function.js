function execute(file, count, Commands){
    let x = Commands.Create[count]
    if(file[x]){
        const result = await file[x].create()   
        if(result.finished && count < Commands.Create.length){
            count++
            execute(file, count, Commands)
        }
    }
}

async function deploy_functions(files,Commands,confirmCommands){
    return new Promise((res,rej)=>{
        try{
            Commands.ChangeTableName.map(x=>{
                if(!confirmCommands[`change_tablename_${x}`]){
                    files[x['Table']] ? files[x['Table']].ChangeTableName(x) : null
                    confirmCommands[`change_tablename_${x}`] = true
                }
            })
    
            Commands.Update_Column.map(x=>{
                if(!confirmCommands[`update_column_${x}`]){
                    files[x['Table']] ? files[x['Table']].UpdateColumn(x) : null
                    confirmCommands[`update_column_${x}`] = true
                }
            })
    
            Commands.Update_SqliteColumn.map(x=>{
                if(!confirmCommands[`update_sqlitecolumn_${x}`]){
                    if( files[x[0]['Table']] ){
                        files[x[0]['Table']].DropColumn(x[0])
                        setTimeout(()=>{
                            files[x[1]['Table']].AddColumn(x[1])
                    
                        },600)
                        confirmCommands[`update_sqlitecolumn_${x}`] = true
                    }
                }
            })
    
            Commands.Rename_Column.map(x=>{
                if(!confirmCommands[`rename_column_${x}`]){
                    setTimeout(()=>{
                        files[x['Table']] ? files[x['Table']].RenameColumn(x) : null
                        confirmCommands[`rename_column_${x}`] = true
                    },600)
                }
            })
            
            Commands.New_Column.map(x=>{
                if(!confirmCommands[`new_column_${x}`]){
                    files[x['Table']] ? files[x['Table']].AddColumn(x) : null
                    confirmCommands[`new_column_${x}`] = true
                }
            })
    
            Commands.Drop.map(x=>{
                if(!confirmCommands[`drop_${x}`]){
                    var droppingTable = []
    
                    var instances = x.instances
                    var mainTable = x.table
                    var appName = x.appName
    
                    for(var n in instances){
                        if(instances[n].motherTable){
                            let table = `${mainTable}__${appName}_${instances[n].motherTable}`
                            droppingTable.push(table)
                        }
                    }
                    let cascade = ''
                    db_connection.db_name !== 'sqlite3' && db_connection.db_name === 'psql'  ||  db_connection.db_name === 'mysql' ? cascade = 'CASCADE' : null ;
                    droppingTable.push(`${mainTable}`)
                    droppingTable.map(a=>{
                        var q =`DROP TABLE IF EXISTS ${a} ${cascade}`
                        // console.log(q)
                        if(db_connection.db_name === 'sqlite3'){
                            db_connection.connector.run(q,(err)=>{
                                if(err) throw err;
                                console.log(`${a} dropped`)
                            })
                        }else{
                            db_connection.connector.query(q,(err)=>{
                                if(err) throw err
                                console.log(`${a} dropped`)
                            })
                        }
                    })
                    confirmCommands[`drop_${x}`] = true
                }
            })
            
            Commands.Drop_Column.map(x=>{
                if(!confirmCommands[`drop_column_${x}`]){
                    files[x['Table']] ? files[x['Table']].DropColumn(x) : null
                    confirmCommands[`drop_column_${x}`] = true
                }
            })
    
            if(Commands.Create.length > 0){
                let count = 0
                execute(files,count,Commands)
            }
            
            // Commands.Create.map(async (x) =>{
            //     if(!confirmCommands[`create_${x}`]){
            //         files[x] ? await files[x].create()  : null
            //         confirmCommands[`create_${x}`] = true
            //     }
            // })
            res(true)   
        } catch (err){
            rej(err);
        }
    })
}
module.exports = deploy_functions