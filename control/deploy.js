//to argument = {settings,init}
function deploy(constraints){
    // let path = require('path');
    let fs = require('fs')
    let {structures,db_connection} = constraints.settings
    let RootDirectory = constraints.init 
    let ToDeployFiles = `${RootDirectory}/QT_FOLDER/ToDeployFiles`
    let {DeployedFileList} = require(`${RootDirectory}/QT_FOLDER/tracker.js`)
    let DeployFileBank = []
    let DeployedFileList2 = DeployedFileList
    let FILE = fs.readdirSync(ToDeployFiles)

    FILE.map(itm=>{
    if(!(DeployedFileList.includes(itm))){
        DeployFileBank.push(itm)
    }
    })
    if(DeployFileBank.length === 0){
        console.log("\nNo table to deploy\n")
    } else {
        try{
            DeployFileBank.map(itm=>{
                var {Commands} = require(`${ToDeployFiles}/${itm}`)
                DeployedFileList2.push(itm)
                structures.map(i=>{
                    const files = require(`${RootDirectory}/${i}`)

                    Commands.ChangeTableName.map(x=>{
                        files[x['Table']] ? files[x['Table']].ChangeTableName(x) : null
                    })

                    Commands.Update_Column.map(x=>{
                        files[x['Table']] ? files[x['Table']].UpdateColumn(x) : null
                    })

                    Commands.Update_SqliteColumn.map(x=>{
                        if( files[x[0]['Table']] ){
                            files[x[0]['Table']].DropColumn(x[0])
                            setTimeout(()=>{
                                files[x[1]['Table']].AddColumn(x[1])
                        
                            },600)
                        }
                    })

                    Commands.Rename_Column.map(x=>{
                        files[x['Table']] ? files[x['Table']].RenameColumn(x) : null
                    })
                    
                    Commands.New_Column.map(x=>{
                        files[x['Table']] ? files[x['Table']].AddColumn(x) : null
                    })

                    Commands.Drop.map(x=>{
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
                    })
                    
                    Commands.Drop_Column.map(x=>{
                        files[x['Table']] ? files[x['Table']].DropColumn(x) : null
                    })

                    Commands.Create.map(x=>{
                        setTimeout(()=>{
                            files[x] ? files[x].create()  : null
                        },1500)
                    })
                })
            })

            var writeToTracker = '\n'

            DeployedFileList2.map(i=>{
                writeToTracker += `\t'${i}',\n`
            })

            fs.writeFileSync(`${RootDirectory}/QT_FOLDER/tracker.js`,
            `const DeployedFileList = [`+
                `${writeToTracker}`+
            `]\n\n`+
            
            `module.exports = {DeployedFileList}
            `
            )

        } catch(err){
            console.error(err)
        }
    }
}

module.exports = deploy