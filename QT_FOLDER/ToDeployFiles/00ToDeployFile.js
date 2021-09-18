const Commands = {
	Drop:[],
	Create:[
		"myTable2",
		"myTable",
		"myTable3",
	],
	New_Column:[],
	Update_Column:[],
	Update_SqliteColumn:[],
	Drop_Column:[],
	Rename_Column:[],
	ChangeTableName:[],
}

const tables = {
	myTable2:{
		table_name:"xatisfy_SOLI",
		columns:["name","age"],
		dataTypes:{"name":{"value":"Varchar(100)   NOT NULL","primaryKey":false,"rename":[false,null],"dataType":"Varchar","qNull":"NOT NULL","qDefaultValue":"","qWidth":"(100)","qUnique":""},"age":{"value":"Int   ","primaryKey":"","rename":[false,null],"dataType":"Int","qNull":"","qDefaultValue":"","qWidth":"","qUnique":""}},
		force:false,
		app_name:"xatisfy",
	},
	myTable:{
		table_name:"xatisfy_MADZ",
		columns:["name","soli","ace","great"],
		dataTypes:{"name":{"value":"Varchar(100)  UNIQUE NOT NULL","primaryKey":false,"rename":[false,null],"dataType":"Varchar","qNull":"NOT NULL","qDefaultValue":"","qWidth":"(100)","qUnique":"UNIQUE"},"soli":{"value":"Varchar(10) DEFAULT '[]'  NOT NULL","motherTable":"SOLI","dataType":"Varchar","m2m":true},"ace":{"value":"Int   ","primaryKey":"","rename":[false,null],"dataType":"Int","qNull":"","qDefaultValue":"","qWidth":"","qUnique":""},"great":{"value":"Varchar(100)   NOT NULL","JSON":true,"rename":[false,null],"dataType":"Varchar","qWidth":100,"qNull":"","qDefaultValue":"","qUnique":""}},
		force:false,
		app_name:"xatisfy",
	},
	myTable3:{
		table_name:"xatisfy_Capacity",
		columns:["ike","height","muscleSize","madz","age"],
		dataTypes:{"ike":{"value":"Varchar(100)   NOT NULL","JSON":true,"rename":[false,null],"dataType":"Varchar","qWidth":100,"qNull":"","qDefaultValue":"","qUnique":""},"height":{"value":"Int   ","primaryKey":"","rename":[false,null],"dataType":"Int","qNull":"","qDefaultValue":"","qWidth":"","qUnique":""},"muscleSize":{"value":"Varchar(10)   NOT NULL","primaryKey":true,"rename":[false,null],"dataType":"Varchar","qNull":"NOT NULL","qDefaultValue":"","qWidth":"(10)","qUnique":""},"madz":{"value":"Int   ","referencedTable":"SOLI","dataType":"Int"},"age":{"value":"Varchar(10)   NOT NULL","primaryKey":false,"rename":[false,null],"dataType":"Varchar","qNull":"NOT NULL","qDefaultValue":"","qWidth":"(10)","qUnique":""}},
		force:false,
		app_name:"xatisfy",
	},
}

module.exports = {Commands,tables}