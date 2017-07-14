//磁盘信息数据集合
Ext.define('websure.backup.store.ClusterAllDeviceHardDiskStore', {  
	    extend:'Ext.data.TreeStore',
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
        ],
        /*params :{
        	clusterId:-2
        },
        proxy: {  
            type: 'ajax',  
            url: '/backup/todeviceAction!getClusterShareHardDiskInfoForCreate.action'  
        },  
        reader : {
			type : 'json',
			root: 'children'
		},*/
        folderSort: true
    });  



