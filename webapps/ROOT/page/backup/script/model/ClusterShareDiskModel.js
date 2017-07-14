Ext.define('websure.backup.model.ClusterShareDiskModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name : 'computerHardName', type: 'string'},
    		{name : 'clusterSharediskIndex', type: 'int'},
    		{name: 'hardDiskId',    type: 'int'}, 
            {name: 'totalSector', type: 'string'}/*,  
            {name: 'fileSystem',  type: 'string'}*/
        ]  
});