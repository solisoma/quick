const {RootDirectory} = require('../public_access.js')
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

const alreadyExistingFiles = [`${RootDirectory}/settings.js`,`${RootDirectory}/tracker.js`]
const toBeCreatedFiles = [`${Directory}/settings.js`,`${Directory}/tracker.js`]

const multiTask = (alreadyExistingFiles,toBeCreatedFiles)=>{
    var holdValues = [];
    var result;
    try{
        alreadyExistingFiles.map((itm)=>{
           var put = fs.readFileSync(itm,'utf-8')
           holdValues.push(put)
        });

        for(var i=0;i<holdValues.length;i++){
            fs.writeFileSync(toBeCreatedFiles[i],holdValues[i])
            console.log(`File "${toBeCreatedFiles[i]}" has being created\n`)
        };
        console.log('All files created successfully\n')
    }catch(err){
        if(err.name == 'TypeError' ){
            result= `Make sure your first two arguments are list\nExample: [C:/Users/myOwn/myWork.js, C:/Users/myOwn/myAnotherWork.js]\nif your list length is one: [C:/Users/myOwn/myWork.js,]`;
            console.log(result)
        }else{
            console.log(err)
        }

    }
}

multiTask(alreadyExistingFiles,toBeCreatedFiles)