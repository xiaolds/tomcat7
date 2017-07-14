Ext.define('websure.backup.model.ClusterDiskInfoModel', {
    extend: 'Ext.data.Model',
    alias:"widget.ClusterDiskInfoModel",
    fields: [
        {name: 'deviceId', type: 'string'},
        {name: 'hardDiskId', type: 'string'},
        {name: 'partitionId', type: 'string'},
		{name: 'standbyModel',type: 'string'},
        {name: 'deviceType',    type: 'string'},  
        {name: 'isHardDisk',    type: 'string'},  
        {name: 'device_hard_partition_Name',    type: 'string'},  
        {name: 'needBack',    type: 'string'},  
        {name: 'hardDiskIsShared',    type: 'string'},
        {name: 'shareClusterId',    type: 'string'},
        {name: 'hardType',      type: 'string'},  
        {name: 'hardIndex',      type: 'string'},  
        {name: 'harddiskNeedbackup',      type: 'string'},  
        {name: 'totalSector', type: 'string'},
        { name: 'mountInfo', type: 'string' },
        { name: 'clusterType', type: 'string' },
        { name: 'fileSystem', type: 'string' }
    ]
});