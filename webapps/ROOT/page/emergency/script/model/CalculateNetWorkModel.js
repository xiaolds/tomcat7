
Ext.define("acesure.emergency.model.CalculateNetWorkModel",{
	extend:"Ext.data.Model",
	alias:"widget.CalculateNetWorkModel",
	fields:[
	        {name:"calId",type:"int",mapping:"computeId"},
	        {name:"name",type:"string",mapping:"computeNicName"},
	        {name:"index",type:"int",mapping:"computeNicIndex"}
	]
});