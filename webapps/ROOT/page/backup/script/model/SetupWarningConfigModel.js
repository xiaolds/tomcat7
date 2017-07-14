Ext.define('websure.backup.model.SetupWarningConfigModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name : 'configInfoId',   type: 'int'},
    		{name : 'configModelId', type: 'int'},
    		{name : 'configModeShow', type: 'string'},
    		{name : 'configTargetId', type: 'string'},
    		{name : 'timeAndFrequency', type: 'string'}
        ]  
});