Ext.define('acesure.model.sysLog.BackupDBLogModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'backupDBId', 				type: 'int' 	},
        { name: 'backupDBDeviceId', 		type: 'string' 	},
        { name: 'backupDBUserName', 		type: 'string' 	},
        { name: 'backupDBContent', 			type: 'string' 	},
        { name: 'backupDBIp',				type: 'string' 	},
        { name: 'backupDBEventId', 			type: 'int' 	},
        { name: 'backupDBLevel', 			type: 'int' 	},
        { name: 'backupDBType', 			type: 'int' 	},
        { name: 'backupDBInsertTime', 		type: 'string' 	},
        { name: 'backupDBRemark', 			type: 'string' 	}
    ]
});