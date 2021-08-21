let ToDeployFiles = `${process.cwd()}/QT_FOLDER/ToDeployFiles`
let {DeployedFileList} = require(`${process.cwd()}/QT_FOLDER/tracker.js`)
let fs = require('fs')
let {structures} = require(`${process.cwd()}/QT_FOLDER/settings.js`)
let FILE = fs.readdirSync(ToDeployFiles)
let DeployFileBank = []
let DeployedFileList2 = DeployedFileList

FILE.map(itm=>{
if(!(DeployedFileList.includes(itm))){
    DeployFileBank.push(itm)
}
})
if(DeployFileBank.length === 0){
    console.log("No Table to Deploy\n")
} else {
    DeployFileBank.map(itm=>{
        var {Commands} = require(`${ToDeployFiles}/${itm}`)
        DeployedFileList2.push(itm)
        structures.map(i=>{
            const files = require(`${process.cwd()}/${i}`)
            Commands.Drop.map(x=>{
                files[x] ? files[x].drop() : null
            })

            Commands.Create.map(x=>{
                files[x] ? files[x].create()  : null
            })

            Commands.New_Column.map(x=>{
                files[x] ? files[x].AddColumn() : null
            })

            Commands.Update_Column.map(x=>{
                files[x] ? files[x].UpdateColumn() : null
            })

            Commands.Drop_Column.map(x=>{
                files[x] ? files[x].DropColumn() : null
            })
        })
    })
}
fs.writeFileSync(`${process.cwd()}/QT_FOLDER/tracker.js`,
`const DeployedFileList = ${JSON.stringify(DeployedFileList2)}

module.exports = {DeployedFileList}`)