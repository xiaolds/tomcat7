Ext.define('acesure.recovery.model.NewStorageConfigModel', {
    extend: 'Ext.data.Model',
    alias:"widget.NewStorageConfigModel",
    fields: [
        { name: 'symbol', type:'String'},
        { name: 'path', type:'String'},
        { name: 'id', type:'String'},
        { name: 'text', type:'String'},
        { name: 'storageId', type:'String'}
    	
    ]
});