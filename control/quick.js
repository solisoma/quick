function init(directory){
    const RootDirectory = directory ? directory : process.cwd()
    const ModelDirectory = process.cwd()
    const fs = require('fs')

    if(!(fs.readdirSync(RootDirectory).includes('QT_FOLDER'))){
        fs.mkdirSync(`${RootDirectory}/QT_FOLDER`)
        console.log(`Directory "${RootDirectory}/QT_FOLDER" has being created\n`)
    }

    if(!(fs.readdirSync(`${RootDirectory}/QT_FOLDER`).includes('ToDeployFiles'))){
        fs.mkdirSync(`${RootDirectory}/QT_FOLDER/ToDeployFiles`)
        console.log(`Directory "${RootDirectory}/QT_FOLDER/ToDeployFiles" has being created\n`)
    }

    const Directory = `${RootDirectory}/QT_FOLDER`
    const tracker = `const DeployedFileList = []\n\nmodule.exports = {DeployedFileList}`
    
    try{
        if(!(fs.readdirSync(`${Directory}`).includes('tracker.js'))){
            fs.writeFileSync(`${Directory}/tracker.js`,tracker)
            console.log(`File "${Directory}/tracker.js" has being created\n`)  
            console.log('All files created successfully\n')    
        }
    }catch(err){
        console.error(err)
    }
    
    // const alreadyExistingFiles = [`/tracker.js`]
    // const toBeCreatedFiles = [`${Directory}/tracker.js`]

    // const multiTask = (alreadyExistingFiles,toBeCreatedFiles)=>{
    //     var holdValues = [];
    //     var result;
    //     try{
    //         alreadyExistingFiles.map((itm)=>{
    //         var put = fs.readFileSync(itm,'utf-8')
    //         holdValues.push(put)
    //         });

    //         for(var i=0;i<holdValues.length;i++){
    //             fs.writeFileSync(toBeCreatedFiles[i],holdValues[i])
    //             console.log(`File "${toBeCreatedFiles[i]}" has being created\n`)
    //         };
    //         console.log('All files created successfully\n')
    //     }catch(err){
    //         if(err.name == 'TypeError' ){
    //             result= `Make sure your first two arguments are list\nExample: [C:/Users/myOwn/myWork.js, C:/Users/myOwn/myAnotherWork.js]\nif your list length is one: [C:/Users/myOwn/myWork.js,]`;
    //             console.log(result)
    //         }else{
    //             console.log(err)
    //         }

    //     }
    // }

    // multiTask(alreadyExistingFiles,toBeCreatedFiles)

    return {RootDirectory,ModelDirectory}
}

module.exports = init