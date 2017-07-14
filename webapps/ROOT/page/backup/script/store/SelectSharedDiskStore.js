//磁盘信息数据集合
Ext.define('websure.backup.store.SelectSharedDiskStore', {  
	    extend:'Ext.data.TreeStore',
        model: 'websure.backup.model.SelectSharedDiskModel',
        params :{
        	deviceId:-2
        },
        proxy: {  
            type: 'ajax',  
//            url: '/data/treeGridData.js'  
            url: '/backup/todeviceAction!getPartitionByDeviceId.action'  
        },  
        reader : {
			type : 'json'/*,
			root: 'children'*/
		},
        folderSort: true  
    });  

