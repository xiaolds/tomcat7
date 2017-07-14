
Ext.define('acesure.config.store.CalNodeStore', {
	extend : 'Ext.data.Store',
	model : 'acesure.config.model.CalNodeModel',
	proxy : {
		type : 'ajax',
		url : '/emergency/tocomputeNodes!getComputeNodeConfigInfo.action',
		reader : {
			type : 'json',
			root : 'detail',
			totalProperty : 'total' // 数据总条数
		}
	}
	
});