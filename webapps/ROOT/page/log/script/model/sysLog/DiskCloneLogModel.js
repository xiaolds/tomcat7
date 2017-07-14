Ext.define('acesure.model.sysLog.DiskCloneLogModel',{
	extend: 'Ext.data.Model',
    alias: 'widget.diskCloneLogModel',
    fields: [
    	{ name: 'diskCloneLogId', 			type: 'int' 	},
        { name: 'diskCloneId', 				type: 'int' 	},
        { name: 'diskCloneLogLevel', 		type: 'int' 	},
        { name: 'diskCloneEventId', 		type: 'int' 	},
        { name: 'diskCloneLogIp', 			type: 'String' 	},
        { name: 'diskCloneLogType', 		type: 'int' 	},
        { name: 'diskCloneLogContent', 		type: 'String' 	},
        { name: 'diskCloneLogCreateTime', 	type: 'String' 	}
    ]
})