/**
 * author:yangbobin
 * date:2016-9-1
 * dest:源介质 及目标介质同步 Model
 * 
 */
Ext.define('acesure.config.model.StoragePathTreeModel', {
    extend: 'Ext.data.Model',
    alias:"widget.StoragePathTreeModel",
    fields: [
        { name: 'symbol', type:'String'},
        { name: 'path', type:'String'},
        { name: 'id', type:'String'},
        { name: 'text', type:'String'},
        { name: 'storageId', type:'String'}
        
    ]
});