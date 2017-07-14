Ext.define('acesure.model.sysLog.ManageLogModel',{
	extend: 'Ext.data.Model',
    alias: 'widget.manageLogModel',
    fields: [
    	{ name: 'manageLogId', 				type: 'int' 	},
        { name: 'manageDeviceId', 			type: 'string' 	},
        { name: 'manageLogContent', 		type: 'string' 	},
        { name: 'manageLogIp', 				type: 'string' 	},
        { name: 'manageLogLevel', 			type: 'int' 	},
        { name: 'manageLogType', 			type: 'int' 	},
        { name: 'manageLogInsertTime', 		type: 'string' 	},
        { name: 'manageLogRemark', 			type: 'string'	}
    ]
})