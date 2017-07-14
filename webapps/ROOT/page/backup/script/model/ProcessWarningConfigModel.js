Ext.define('websure.backup.model.ProcessWarningConfigModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name : 'processWarningId',   type: 'int'},
    		{name : 'processWarningName', type: 'string'},
    		{name : 'processWarningState', type: 'int'}
        ]  
});