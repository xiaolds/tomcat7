Ext.define('websure.backup.model.ServerWarningConfigModel', {
    extend: 'Ext.data.Model',
    fields: [  
			{name : 'scriptWarningId', type: 'int'},
			{name : 'deviceId', type: 'int'},
			{name : 'deviceMac',   type: 'String'},
			{name : 'scriptWarningName',   type: 'String'},
			{name : 'scriptWarningServerType', type: 'int'},
			{name : 'scriptWarningState', type: 'int'},
			{name : 'scriptWarningLevel', type: 'int'},
			{name : 'scriptWarningServerText', type: 'String'},
			{name : 'scriptWarningServerName', type: 'String'},
			{name : 'scriptWarningReturnValue', type: 'String'},
			{name : 'configState', type: 'int'},
			{name : 'configRunTimeInterval', type: 'int'},
			{name : 'configRunTimeIntervalUnit', type: 'int'},
			{name : 'scriptValue', type: 'String'},
			{name : 'notifyTable', type: 'String'},
			{name : 'notifyTime', type: 'String'}
        ]  
});