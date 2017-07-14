Ext.define('websure.backup.model.ClusterDeviceModel', {
    extend: 'Ext.data.Model',
    fields: [
	    {name : 'deviceId',type: 'int'},
	    {name : 'deviceShowName',type: 'string'},
	    {name : 'masterCount',type: 'int'},
	    {name : 'standbyModel',type: 'int'}
    ]
});