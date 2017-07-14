Ext.define("acesure.emergency.model.EmergencyInitializeModel",{
	extend:"Ext.data.Model",
	alias:"widget.emergencyInitializeModel",
	fields:[
	        {name:"nodeId",type:"int"},
	        {name:"nodeUniqueId",type:"string"},
	        {name:"nodeName",type:"string"},
	        {name:"nodeIpLan",type:"string"},
	        {name:"nodeIpNet",type:"string"},
	        {name:"nodeState",type:"int"},//节点状态 1.在线 2.离线 3.异常
	        {name:"nodeStoragePort",type:"int"},
	        {name:"nodeLocalPort",type:"int"},
	        {name:"nodeMagPort",type:"int"},
	        {name:"nodeMaxManageNum",type:"int"},
	        {name:"nodeSystemType",type:"int"},
	        {name:"nodeInstallTime"},
	        {name:"nodeVersion",type:"string" },
	        {name:"nodeCreateTime"},
	        {name:"nodeUpdateTime"},
	        {name:"remark",type:"string"},
	        {name:"authorized",type:"int"}
	]
});