Ext.define('acesure.model.sysLog.StorageLogModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'storageLogId', 			type: 'int' 	},
        { name: 'storageId', 				type: 'string' 	},
        { name: 'storageLogContent', 		type: 'string' 	},
        { name: 'storageLogIp',				type: 'string' 	},
        { name: 'storageEventId', 			type: 'int' 	},
        { name: 'storageLogLevel', 			type: 'int' 	},
        { name: 'storageLogType', 			type: 'int' 	},
        { name: 'storageLogInsertTime', 	type: 'string' 	},
        { name: 'storageLogRemark', 		type: 'string' 	}
    ]
});