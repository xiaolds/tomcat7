Ext.define('websure.backup.model.StorageConfigDBModel', {
    extend: 'Ext.data.Model',
    alias:"widget.StorageConfigDBModel",
    fields: [
        { name: 'symbol', type:'String'},
        { name: 'path', type:'String'},
        { name: 'id', type:'String'},
        { name: 'text', type:'String'},
        { name: 'storageId', type:'String'}
    	
    ]
});