Ext.define('acesure.emergency.store.ComputeNodesNetWorkStore', {
	extend: 'Ext.data.Store',
	alias:"widget.ComputeNodesNetWorkStore",
	model:"acesure.emergency.model.ComputeNodeNetWorkModel",
	proxy:{
		type : 'ajax',
		url : '/emergency/tocomputeNodesNic!getCalculateNodesByNodeId.action',
		reader : {
			type : 'array',
			root: 'detail'
		}
	}
});
