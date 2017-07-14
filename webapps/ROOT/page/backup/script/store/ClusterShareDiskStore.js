
//共享磁盘信息数据集合
Ext.define('websure.backup.store.ClusterShareDiskStore', {  
	    extend:'Ext.data.TreeStore',
        model: 'websure.backup.model.ClusterShareDiskModel',
        params :{
        	clusterId:-1,
        	clusterSharediskIndex:-1
        },
        proxy: {  
            type: 'ajax',  
            url: '/backup/todeviceAction!getClusterShareHardDiskInfo.action'  
        },  
        reader : {
			type : 'json',
			root: 'children'
		},
        folderSort: true  
    }); 