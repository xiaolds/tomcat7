//备份详情策略
Ext.define('websure.backup.store.ClusterDeviceLogStore', {  
	    extend: 'Ext.data.Store',
        model: 'websure.backup.model.ClusterDeviceLogModel',
        params :{
        	start: 0, 
        	limit: 10
        },
        proxy: {  
            type: 'ajax',  
            url: '/backup/toclusterAction!getClusterLogByClusterId.action',
            reader : {
			  type: 'json', //返回数据类型为json格式
              root: 'detail', //数据
			  totalProperty: 'total' //数据总条数
			}
        },
       pageSize : 10// 每页显示条目数量
//        autoLoad: true
    });