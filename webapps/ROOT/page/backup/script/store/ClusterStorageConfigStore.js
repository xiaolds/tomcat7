Ext.define('websure.backup.store.ClusterStorageConfigStore', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.ClusterStorageConfigStore",
    model:"websure.backup.model.ClusterStorageConfigModel",
    proxy:{
    	type : 'ajax',
		url : '/backup/toclusterAction!getStoPathByStorageId.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});