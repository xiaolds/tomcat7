	Ext.define('acesure.emergency.store.GridStore', {
		extend:"Ext.data.JsonStore",	
	   // model:"GridModel",
	    alias:"widget.GridStore",
	    fields:[
		        {name:"calNodeIp",type:"string"},
		        {name:"calNodePort",type:"int"},
		        {name:"calNodeName",type:"string"},
		        {name:"calCpuAbl",type:"int"},
		        {name:"calMemAbl",type:"int"},
		        {name:"calHarAbl",type:"int"},
		        {name:"runComNum",type:"int"},
		        {name:"totComNum",type:"int"},
		        {name:"ascTotNum",type:"int"},
		        {name:"state",type:"int"}
		],
	    data : 
            [
               {   "calNodeIp":"192.168.0.1",
	            	"calNodePort":8080,
	            	"calNodeName":"计算节点1",
	            	"calCpuAbl":50,
	            	"calMemAbl":50,
	            	"calHarAbl":50,
	            	"runComNum":0,
	            	"totComNum":50,
	            	"ascTotNum":50,
	            	"state":0
            	},
            	{  
            		"calNodeIp":"192.168.0.2",
                	"calNodePort":8080,
                	"calNodeName":"计算节点2",
                	"calCpuAbl":50,
                	"calMemAbl":50,
                	"calHarAbl":50,
                	"runComNum":0,
                	"totComNum":50,
                	"ascTotNum":50,
                	"state":1
                	}
            ],
             autoLoad: true //很关键
	});