Ext.define('websure.backup.model.BackupDBLogModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name : 'backupDBId',   type: 'int'},
    		{name : 'backupDBDeviceId',   type: 'string'},
    		{name : 'backupDBEventId',   type: 'int'},
    		{name : 'backupDBContent', type: 'string'},
    		{name : 'backupDBIp',   type: 'string'},
    		{name : 'backupDBLevel',   type: 'int'},
    		{name : 'backupDBType',   type: 'int'},
    		{name : 'backupDBInsertTime',   type: 'string'}
        ]  
});