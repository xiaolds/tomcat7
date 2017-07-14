Ext.define('websure.backup.model.ConfigDiskInfoModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name : 'checked',	  type: 'boolean'},
    		{name : 'hardDiskId', type: 'string'},
    		{name : 'partitionId',type: 'string'},
            {name: 'hardName',    type: 'string'},  
            {name: 'letter',      type: 'string'},  
            {name: 'totalSector', type: 'string'},  
            {name: 'fileSystem',  type: 'string'}, 
            {name: 'runningStatus',  type: 'string'} 
        ]  
});