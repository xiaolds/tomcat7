Ext.define('acesure.config.model.CalNodeModel', {
	extend : 'Ext.data.Model',
	alias:"widget.CalNodeModel",
	fields : [ 
	          	{name:"nodeId",type:"string"},
	          	{name:"nodeName",type:"string"},
	          	{name:"nodeUniqueName",type:"string"},
	          	{name:"nodeIpLan",type:"string"},
	          	//{name:"ipTotal"},
	          	{name:"nodeIpNet",type:"string"},
	          	{name:"nodeState",type:"string"},
	          	{name:"nodeStoragePort",type:"string"},
	            {name:"nodeLocalPort",type:"string"},
		        {name:"nodeMagPort",type:"string"},
		        {name:"nodeMaxNum",type:"string"},
		        {name:"nodeSysType",type:"string"},
		        {name:"nodeInstallTime",type:"string"},
		        {name:"nodeVersion",type:"string"},
		        {name:"nodeCreateTime",type:"string"},
		        {name:"nodeUpdateTime",type:"string"},
		        {name:"authorized",type:"int"}
		        /*{name:"nodeCpu",type:"int"},
		        {name:"nodeMem",type:"int"},
		        {name:"nodeNet",type:"int"},*/
		        ]
});