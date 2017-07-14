Ext.define('acesure.model.sysLog.EmergencyLogModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'emergencyLogId', 			type: 'int' 	},
        { name: 'emergencyDeviceId', 		type: 'string' 	},
        { name: 'emergencyLogContent', 		type: 'string' 	},
        { name: 'emergencyLogIp',			type: 'string' 	},
        { name: 'emergencyEventId', 		type: 'int' 	},
        { name: 'emergencyLogLevel', 		type: 'int' 	},
        { name: 'emergencyLogType', 		type: 'int' 	},
        { name: 'emergencyLogInsertTime', 	type: 'string' 	},
        { name: 'emergencyLogRemark', 		type: 'string' 	}
    ]
});