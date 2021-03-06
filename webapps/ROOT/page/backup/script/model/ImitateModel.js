Ext.define('websure.backup.model.ImitateModel', {
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
    		{name : 'scriptName', type: 'String'},
    		{name : 'scriptWarningReturnValue', type: 'String'},
    		{name : 'scriptWarningUrl', type: 'String'},
    		{name : 'scriptWarninDB', type: 'int'},
    		{name : 'scriptWarninDrive', type: 'int'},
    		{name : 'scriptWarninSystem', type: 'int'},
    		{name : 'scriptWarninInstallPath', type: 'String'},
    		{name : 'scriptWarninDBName', type: 'String'},
    		{name : 'scriptWarninDBPort', type: 'int'},
    		{name : 'scriptWarninUserName', type: 'String'},
    		{name : 'scriptWarninUserPwd', type: 'String'},
    		{name : 'scriptWarninDBTable', type: 'String'},
    		{name : 'configInfoId', type: 'int'},
    		{name : 'configState', type: 'int'},
    		{name : 'configRunTimeInterval', type: 'int'},
    		{name : 'configRunTimeIntervalUnit', type: 'String'},
    		{name : 'configContRunTimeInterval', type: 'int'},
    		{name : 'configContRunTimeIntervalUnit', type: 'String'}
    	]  
});