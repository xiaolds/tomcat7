
Ext.define("acesure.emergency.model.GridModel",{
	extend:"Ext.data.Model",
	alias:"widget.GridModel",
	fields:[
	        {name:"online",type:"int"},
	        {name:"serverName",type:"string"},
	        {name:"sourceIp",type:"string"},
	        {name:"sourceServerName",type:"string"},
	        {name:"computeNode",type:"string"},
	        {name:"ability",type:"auto"},
	        {name:"state",type:"int"}
	]
});