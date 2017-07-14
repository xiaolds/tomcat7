Ext.define('acesure.model.sysLog.SystemLogModel', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'systemLogId', 				type: 'int' 	},
        { name: 'systemLogManager', 		type: 'string' 	},
        { name: 'systemLogSource', 			type: 'string' 	},
        { name: 'systemLogLevel', 			type: 'int' 	},
        { name: 'systemLogType', 			type: 'int' 	},
        { name: 'systemLogContent', 		type: 'string' 	},
        { name: 'systemLogInsertTime', 		type: 'string'	}
    ]
});