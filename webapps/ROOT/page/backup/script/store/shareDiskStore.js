
//共享磁盘信息数据集合
Ext.define('websure.backup.store.shareDiskStore', {  
	    extend:'Ext.data.TreeStore',
        model: 'websure.backup.model.shareDiskModel',
        params :{
        	deviceId:-2
        },
        proxy: {  
            type: 'ajax',  
            url: '/backup/todeviceAction!getshareHardDiskInfo.action'  
        },  
        reader : {
			type : 'json',
			root: 'children'
		},
        folderSort: true  
    });  



