	Ext.define('acesure.emergency.store.GridStore', {
		extend:"Ext.data.JsonStore",	
	   // model:"GridModel",
	    alias:"widget.GridStore",
	    fields:[
		        {name:"online",type:"int"},
		        {name:"serverName",type:"string"},
		        {name:"sourceIp",type:"string"},
		        {name:"sourceServerName",type:"string"},
		        {name:"computeNode",type:"string"},
		        {name:"ability",type:"auto"},
		        {name:"state",type:"int"}
		],
	    data : 
            [{"online":0,"serverName":"servic_name","sourceIp":"192.168.3.16","sourceServerName":"serverName","computeNode":"50","ability":[50,50,50],"state":0},
             {"online":1,"serverName":"servic_name","sourceIp":"192.168.3.16","sourceServerName":"serverName","computeNode":"50","ability":[50,50,50],"state":1},
             {"online":1,"serverName":"servic_name","sourceIp":"192.168.3.16","sourceServerName":"serverName","computeNode":"50","ability":[50,50,50],"state":2}
            ],
             autoLoad: true //很关键
	});