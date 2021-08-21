let ToDeployFiles = `${process.cwd()}/QT_FOLDER/ToDeployFiles`
let {DeployedFileList} = require(`${process.cwd()}/QT_FOLDER/tracker.js`)
let {structures} = require(`${process.cwd()}/QT_FOLDER/settings.js`)
let FILE = fs.readdirSync(RootDirectory)
let DeployFileBank = []

FILE.map(itm=>{
if(!(DeployedFileList.includes(itm))){
    DeployFileBank.push(itm)
}
})

DeployFileBank.map(itm=>{
    var {Commands} = require(${ToDeployFiles}/${itm}`)
    tracker.push(itm)
    structures.map(i=>{
        const files = require(`${process.cwd()}/${itm}`)
        Commands.Drop.map(x=>{
            files[x].drop()
        })

        Commands.Create.map(itm=>{
            files[x].create()
        })

        Commands.New_Column.map(itm=>{
            files[x].AddColumn()
        })

        Commands.Update_Column.map(itm=>{
            files[x].UpdateColumn()
        })

        Commands.Drop_Column.map(itm=>{
            files[x].DropColumn()
        })
    })
    tracker.push(itm)
})
fs.writeFileSync(`${process.cwd()}/QT_FOLDER/tracker.js`,
`const DeployedFileList = ${tracker}

module.exports = {DeployedFileList}`)