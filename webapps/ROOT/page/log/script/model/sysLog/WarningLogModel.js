Ext.define('acesure.model.sysLog.WarningLogModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'warningLogId', 			type: 'int' 	},
        { name: 'warningDeviceId', 			type: 'string' 	},
        { name: 'warningUserName', 			type: 'string' 	},
        { name: 'warningLogContent', 		type: 'string' 	},
        { name: 'warningLogIp',				type: 'string' 	},
        { name: 'warningEventId', 			type: 'int' 	},
        { name: 'warningLogLevel', 			type: 'int' 	},
        { name: 'warningLogType', 			type: 'int' 	},
        { name: 'warningLogInsertTime', 	type: 'string' 	},
        { name: 'warningLogRemark', 		type: 'string' 	}
    ]
});