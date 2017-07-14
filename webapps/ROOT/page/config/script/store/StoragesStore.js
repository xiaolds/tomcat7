Ext.define('acesure.config.store.StoragesStore', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.StoragesStore",
    model:"acesure.config.model.StoragesModel",
    proxy:{
    	type : 'ajax',
		url : '/config/toSystemConfigAction!getStorages.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});