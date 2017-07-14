Ext.define('websure.backup.model.ClusterViewDeviceModel', {
    extend: 'Ext.data.Model',
    fields: [
	    {name : 'deviceId',type: 'int'},
	    {name : '类别',type:'string'},
	    {name : 'deviceName',type: 'string'},
	    {name : 'diskCloneState',type: 'string'},
	    {name : 'deviceIp',type: 'string'},
	    {name : 'standbyModel',type: 'int'},
	    {name : 'progress',type : 'int'},
	    {name : 'details',type : 'string'},
	    {name : 'dwSpeedKB',type : 'int'}
    ]
});