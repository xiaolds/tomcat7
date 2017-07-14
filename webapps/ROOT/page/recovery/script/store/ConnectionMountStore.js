Ext.define('acesure.recovery.store.ConnectionMountStore', {
	extend : 'Ext.data.Store',
	alias : 'widget.ConnectionMountStore',
	model:"acesure.recovery.model.ConnectionStrModel",
	proxy : {
		type : 'ajax',
		url : '/recovery/mountAction!getIscsiConnectionStr.action',
		reader : {
			type : 'json',
			root : 'detail'
		}
	},
	autoLoad:false
});

