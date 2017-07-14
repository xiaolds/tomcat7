
//共享磁盘信息数据集合
Ext.define('websure.backup.store.CascadeSelectShareDiskStore', {  
	    extend:'Ext.data.TreeStore',
        model: 'websure.backup.model.CascadeSelectShareDiskModel',
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
        folderSort: true/*,
        autoLoad: true //很关键
*/    });  



