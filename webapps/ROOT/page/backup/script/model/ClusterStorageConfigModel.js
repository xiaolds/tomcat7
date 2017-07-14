Ext.define('websure.backup.model.ClusterStorageConfigModel', {
    extend: 'Ext.data.Model',
    alias:"widget.ClusterStorageConfigModel",
    fields: [
        { name: 'symbol', type:'String'},
        { name: 'path', type:'String'},
        { name: 'id', type:'String'},
        { name: 'text', type:'String'},
        { name: 'storageId', type:'String'}
    	
    ]
});