const Commands = {"Drop":[],"Create":["myTable","myTable2","myTable3","Table","Table2"],"New_Column":[],"Update_Column":[],"Drop_Column":[]}
const tables = {"myTable":{"table_name":"xatisfy_MADZ","columns":["name","soli","age"],"dataTypes":{"name":{"value":"Varchar(100)  UNIQUE NOT NULL","primaryKey":false},"soli":{"value":"Varchar(10) DEFAULT '[]'  NOT NULL","motherTable":"SOLI"},"age":{"value":"Int   ","primaryKey":""}},"force":false},"myTable2":{"table_name":"xatisfy_SOLI","columns":["name","age"],"dataTypes":{"name":{"value":"Varchar(100)   NOT NULL","primaryKey":false},"age":{"value":"Int   ","primaryKey":""}},"force":false},"myTable3":{"table_name":"xatisfy_Capacity","columns":["ike","height","muscleSize","madz","age"],"dataTypes":{"ike":{"value":"Varchar(100)   NOT NULL","JSON":true},"height":{"value":"Int   ","primaryKey":""},"muscleSize":{"value":"Varchar(10)   NOT NULL","primaryKey":true},"madz":{"value":"Int   ","referencedTable":"SOLI"},"age":{"value":"Int   ","primaryKey":""}},"force":false},"Table":{"table_name":"xatisfy_MADZ","columns":["name","soli","age"],"dataTypes":{"name":{"value":"Varchar(100)  UNIQUE NOT NULL","primaryKey":false},"soli":{"value":"Varchar(10) DEFAULT '[]'  NOT NULL","motherTable":"SOLI"},"age":{"value":"Int   NOT NULL","primaryKey":false}},"force":false},"Table2":{"table_name":"xatisfy_SOLI","columns":["name","age"],"dataTypes":{"name":{"value":"Varchar(100)   NOT NULL","primaryKey":false},"age":{"value":"Int   ","primaryKey":""}},"force":false}}

module.exports = {Commands,tables}