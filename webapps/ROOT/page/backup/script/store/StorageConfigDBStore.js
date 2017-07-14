Ext.define('websure.backup.store.StorageConfigDBStore', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.StorageConfigDBStore",
    model:"websure.backup.model.StorageConfigDBModel",
    proxy:{
    	type : 'ajax',
		url : '/backup/tobackupdbAction!getStoPathDB.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});