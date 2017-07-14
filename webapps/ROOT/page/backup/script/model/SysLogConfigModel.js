Ext.define('websure.backup.model.SysLogConfigModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name : 'sysWarningId',   type: 'int'},
    		{name : 'sysWarningType', type: 'int'},
    		{name : 'sysWarningRuleString', type: 'string'},
    		{name : 'sysWarningStartTime', type: 'string'/*,convert:function(v,rec){var date = rec.raw.diskcloneLogCreateTime;return date.substring(0,10);}*/}
        ]  
});