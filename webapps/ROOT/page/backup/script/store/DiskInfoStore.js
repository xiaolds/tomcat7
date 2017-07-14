//磁盘信息数据集合
Ext.define('websure.backup.store.DiskInfoStore', {  
	    extend:'Ext.data.TreeStore',
//	    model: 'websure.backup.model.DiskInfoModel',
	     fields: [  
	        {name: 'id' , type: 'string'},
    		{name: 'checked',	  type: 'boolean'},
    		{name: 'hardDiskId', type: 'string'},
    		{name: 'partitionId',type: 'string'},
            {name: 'hardName',    type: 'string'},  
            {name: 'hard_partition_Name',    type: 'string'},  
            {name: 'hardType',    type: 'string'},
            {name: 'letter',      type: 'string'},  
            {name: 'totalSector', type: 'string'},  
            {name: 'fileSystem',  type: 'string'}, 
            {name: 'runningStatus',  type: 'string'},
            {name: 'partitionStartSector',  type: 'string'},
            {name: 'disabled',	  type: 'boolean'},
            {name: 'partitionStandbyModel',	  type: 'string'},
            {name: 'mountInfo',	  type: 'string'},
            {name: 'deviceIsStandby',  type: 'string'} 
        ],
       /* params :{
        	deviceId:-2
        },
        proxy: {  
            type: 'ajax',  
            url: '/backup/todeviceAction!getDeviceomtrollerInfo.action'  
        },  
        reader : {
			type : 'json',
			root: 'children'
		},*/
        folderSort: true
    });  



