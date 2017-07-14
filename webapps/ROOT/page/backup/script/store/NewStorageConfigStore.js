Ext.define('websure.backup.store.NewStorageConfigStore', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.NewStorageConfigStore",
    model:"websure.backup.model.NewStorageConfigModel",
    proxy:{
    	type : 'ajax',
		url : '/backup/tobackupAction!getStoPathByStorageId.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});