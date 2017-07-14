Ext.define('acesure.recovery.store.NewStorageConfigStore', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.NewStorageConfigStore",
    model:"acesure.recovery.model.NewStorageConfigModel",
    proxy:{
    	type : 'ajax',
		url : '/recovery/recoveryAction!getStoPathByStorageId.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});