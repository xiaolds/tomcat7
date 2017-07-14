Ext.define('websure.backup.model.BackupTaskInfoModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name: 'id', type: 'string'},
    		{name: 'taskName',type: 'string'},
    		{name: 'state',type: 'string'},
            {name: 'deviceIp',    type: 'string'},  
            {name: 'deviceId', type: 'string'},
            {name: 'deviceOs',    type: 'string'},  
            {name: 'dbType', type: 'string'},  
            {name: 'fileSharePath',  type: 'string'}, 
            {name: 'createTime',  type: 'string'}
        ]
});