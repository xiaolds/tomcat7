Ext.define('acesure.recovery.model.RemoteMountTargetMacModel', {
	extend : 'Ext.data.Model',
	alias:"widget.RemoteMountTargetMacModel",
	fields:[
	        {name:"deviceId",type:"int"},
	        {name:"ip",type:"string"},
	        {name:"computerName",type:"string"},
	        {name:"clientSystype",type:"int"},
	        {name:"sysType",type:"int"},
	        {name:"sourceSystemType",type:"int"},
	        {name:"fc",type:"int"},
	        {name:"iscsi",type:"int"},
	        {name:"clientSysversion",type:"string"}
	        ]
	/*fields : [ 
	          	{name:"id",type:"string"},
	          	{name:"storageName",type:"string"},
	          	{name:"innerIp",type:"string"},
	          	{name:"outerIp",type:"string"},
	          	{name:"operSys",type:"string"},
	          	{name:"instalTime",type:"string"},
	            {name:"calNodeIp",type:"string"},
		        {name:"calNodePort",type:"int"},
		        {name:"calNodeName",type:"string"},
		        {name:"calCpuAbl",type:"int"},
		        {name:"calMemAbl",type:"int"},
		        {name:"calHarAbl",type:"int"},
		        {name:"runComNum",type:"int"},
		        {name:"totComNum",type:"int"},
		        {name:"ascTotNum",type:"int"},
		        {name:"state",type:"int"}]*/
});