Ext.define('websure.backup.model.ClusterDeviceLogModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name : 'diskCloneLogId',   type: 'int'},
    		{name : 'diskCloneEventId',   type: 'int'},
    		{name : 'diskCloneLogLevel',   type: 'int'},
    		{name : 'diskCloneLogIp',   type: 'string'},
    		{name : 'diskCloneLogContent', type: 'string'},
    		{name : 'diskCloneLogCreateTimeForPage', type: 'string'/*,convert:function(v,rec){var date = rec.raw.diskcloneLogCreateTime;return date.substring(0,10);}*/}
        ]  
});