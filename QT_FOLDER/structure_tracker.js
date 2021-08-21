//contains the tables created column and features

let tables = {
                Table:{
                    columns:['name','age','favourite'],
                    dataTypes:{ name: 'Varchar(200)', age: 'int', favourite: 'Varchar(200)'},
                    force:false
                }
             }

module.exports = {tables:tables}