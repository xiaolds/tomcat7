Ext.define('acesure.model.sysLog.ClusterLogModel',{
	extend: 'Ext.data.Model',
    alias: 'widget.clusterLogModel',
    fields: [
    	{ name: 'clusterLogId', 			type: 'int' 	},
        { name: 'clusterId', 				type: 'int' 	},
        { name: 'clusterLogLevel', 		type: 'int' 	},
        { name: 'clusterEventId', 		type: 'int' 	},
        { name: 'clusterLogIp', 			type: 'String' 	},
        { name: 'clusterLogType', 		type: 'int' 	},
        { name: 'clusterLogContent', 		type: 'String' 	},
        { name: 'clusterLogCreateTime', 	type: 'String' 	}
    ]
})