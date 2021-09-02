const Commands = {"Drop":[],"Create":[],"New_Column":[{"Table":"myTable","columnHead":"ace","columnBody":{"value":"Boolean DEFAULT 'true' NOT NULL","primaryKey":false,"rename":[false,null],"dataType":"Boolean","qNull":"NOT NULL","qDefaultValue":"DEFAULT 'true'"}}],"Update_Column":[],"Update_SqliteColumn":[],"Drop_Column":[{"Table":"myTable","column":"age","m2m":false}],"Rename_Column":[]}
const tables = {"myTable2":{"table_name":"xatisfy_SOLI","columns":["name","age"],"dataTypes":{"name":{"value":"Varchar(100)   NOT NULL","primaryKey":false,"rename":[false,null],"dataType":"Varchar","qNull":"NOT NULL","qDefaultValue":"","qWidth":"(100)","qUnique":""},"age":{"value":"Int   ","primaryKey":"","rename":[false,null],"dataType":"Int","qNull":"","qDefaultValue":"","qWidth":"","qUnique":""}},"force":false,"app_name":"xatisfy"},"myTable":{"table_name":"xatisfy_MADZ","columns":["name","soli","ace"],"dataTypes":{"name":{"value":"Varchar(100)  UNIQUE NOT NULL","primaryKey":false,"rename":[false,null],"dataType":"Varchar","qNull":"NOT NULL","qDefaultValue":"","qWidth":"(100)","qUnique":"UNIQUE"},"soli":{"value":"Varchar(10) DEFAULT '[]'  NOT NULL","motherTable":"SOLI","dataType":"Varchar"},"ace":{"value":"Boolean DEFAULT 'true' NOT NULL","primaryKey":false,"rename":[false,null],"dataType":"Boolean","qNull":"NOT NULL","qDefaultValue":"DEFAULT 'true'"}},"force":false,"app_name":"xatisfy"},"myTable3":{"table_name":"xatisfy_Capacity","columns":["ike","height","muscleSize","madz","age"],"dataTypes":{"ike":{"value":"Varchar(100)   NOT NULL","JSON":true,"rename":[false,null],"dataType":"Varchar","qWidth":100},"height":{"value":"Int   ","primaryKey":"","rename":[false,null],"dataType":"Int","qNull":"","qDefaultValue":"","qWidth":"","qUnique":""},"muscleSize":{"value":"Varchar(10)   NOT NULL","primaryKey":true,"rename":[false,null],"dataType":"Varchar","qNull":"NOT NULL","qDefaultValue":"","qWidth":"(10)","qUnique":""},"madz":{"value":"Int   ","referencedTable":"SOLI","dataType":"Int"},"age":{"value":"Boolean  ","primaryKey":false,"rename":[false,null],"dataType":"Boolean","qNull":"","qDefaultValue":""}},"force":false,"app_name":"xatisfy"}}

module.exports = {Commands,tables}