Ext.define('acesure.emergency.store.CalculateNodesStore', {
	extend: 'Ext.data.Store',
	alias:"widget.CalculateNodesStore",
	model:"acesure.emergency.model.ComputeNodesNameModel",
	proxy:{
		type : 'ajax',
		url : '/emergency/tocomputeNodes!getAllCalculateNodesName.action',
		reader : {
			type : 'array',
			root: 'detail'
		}
	},
	autoLoad: false //很关键
});