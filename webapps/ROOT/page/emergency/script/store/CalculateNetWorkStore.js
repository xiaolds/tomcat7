Ext.define('acesure.emergency.store.CalculateNetWorkStore', {
	extend: 'Ext.data.Store',
	alias:"widget.CalculateNetWorkStore",
	//model:"acesure.emergency.model.CalculateNetWorkModel",
	proxy:{
		type : 'ajax',
		url : '/emergency/tocomputeNodesNic!getCalculateNodesByNodeId.action',
		reader : {
			type : 'array',
			root: 'detail'
		}
	}
    //autoLoad: true 
});