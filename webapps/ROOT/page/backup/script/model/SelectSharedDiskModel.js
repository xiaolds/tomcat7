Ext.define('websure.backup.model.SelectSharedDiskModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name : 'checked',	  type: 'boolean'},
    		{name : 'hardDiskId', type: 'string'},
    		{name : 'partitionId',type: 'string'},
    		{name: 'hard_partition_Name',    type: 'string'}, 
            {name: 'hardName',    type: 'string'},  
            {name: 'hardType',    type: 'string'},  
            {name: 'letter',      type: 'string'},  
            {name: 'totalSector', type: 'string'},  
            {name: 'fileSystem',  type: 'string'}  
        ]  
});