Ext.define('acesure.model.report.EntireDeviceModel', {
    extend: 'Ext.data.Model',
    fields: [
       {name: 'deviceId',			type: 'int'		},
       {name: 'notifyState',  		type: 'int'	},
       {name: 'content',   			type: 'String'	},
       {name: 'source',   			type: 'String'	},
       {name: 'notifyTime',   		type: 'String'	},
       {name: 'scriptName',   		type: 'String'	},
       {name: 'continueTime',   	type: 'String'	},
       {name: 'moduleType',    		type: 'int'	}
    ]
});