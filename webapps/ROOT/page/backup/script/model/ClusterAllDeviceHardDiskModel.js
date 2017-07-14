Ext.define('websure.backup.model.ClusterAllDeviceHardDiskModel', {
    extend: 'Ext.data.Model',
    fields: [  
//    		{name: 'checked',	  type: 'boolean'},
    		{name: 'deviceId', type: 'string'},
    		{name: 'standbyModel',type: 'string'},
            {name: 'deviceType',    type: 'string'},  
            {name: 'device_hard_Name',    type: 'string'},  
            {name: 'hardDiskIsShared',    type: 'string'},
            {name: 'hardType',      type: 'string'},  
            {name: 'hardIndex',      type: 'string'},  
            {name: 'totalSector', type: 'string'}
        ]
});