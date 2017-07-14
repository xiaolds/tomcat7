
Ext.define('acesure.emergency.store.ComputeNodesNicStore', {
	extend: 'Ext.data.Store',
	alias:"widget.ComputeNodesNicStore",
	model:"acesure.emergency.model.ComputeNodesNicModel",
	proxy:{
		type : 'ajax',
		url : '/emergency/tocomputeNodesNic!getCalculateNodesByNodeId.action',
		reader : {
			type : 'json',
			root: 'detail'
		}
	}
});
