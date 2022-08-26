//to argument = {settings,init}
function deploy(constraints){
    // let path = require('path');
    let fs = require('fs')
    let deploy_functions = require('./deploy_functions')
    let {structures,db_connection} = constraints.settings
    let {RootDirectory} = constraints.init 
    let {ModelDirectory} = constraints.init 
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
    
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    
    if(DeployFileBank.length === 0){
        console.log("\nNo table to deploy\n")
    } else {
        const completed = DeployFileBank.map(itm=>{
            try{
                var {Commands, confirmCommands} = require(`${ToDeployFiles}/${itm}`)
                DeployedFileList2.push(itm)
                structures.map(async(i)=>{
                    const files = require(`${ModelDirectory}/${i}`)
                    await deploy_functions(files,Commands,confirmCommands)
                })

                const regExp = /const confirmCommands[\s\=\{\w\_\:\,]+\}/igm
                let toChangeFile = fs.readFileSync(`${ToDeployFiles}/${itm}`,'utf-8')
                var writetoDeployConfirm = ''
                for(var i in confirmCommands){
                    var keys = `\n\t${i}: ${confirmCommands[i]},`;
                    writetoDeployConfirm += keys
                }
                toChangeFile = toChangeFile.replace(regExp,
                    `const confirmCommands = {`+
                        `${writetoDeployConfirm}\n`+
                    `}`)
                fs.writeFileSync(`${ToDeployFiles}/${itm}`,toChangeFile)


                return true
            } catch(err){
                console.error(err)
                return false
            }
        })
        
        if(completed){
            // Write to the tracker only if all executions are successfull
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
        }
    }
}


module.exports = deploy