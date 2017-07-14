Ext.define('acesure.config.model.StoragesModel', {
    extend: 'Ext.data.Model',
    alias:"widget.StoragesModel",
    fields: [
        { name: 'symbol', type:'String'},
        { name: 'path', type:'String'},
        { name: 'id', type:'String'},
        { name: 'text', type:'String'},
        { name: 'storageId', type:'String'}
    	
    ]
});