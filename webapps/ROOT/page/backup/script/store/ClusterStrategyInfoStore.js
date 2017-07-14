//备份详情策略
Ext.define('websure.backup.store.ClusterStrategyInfoStore', {  
	    extend: 'Ext.data.Store',
        model: 'websure.backup.model.ClusterStrategyInfoModel',
        params :{
        	deviceId:-2
        },
        proxy: {  
            type: 'ajax',  
            url: '/backup/toclusterAction!getClusterBackUpStrategyInfo.action',
            reader : {
			  type: 'json', //返回数据类型为json格式
              root: 'detail' //数据
			}
        }
        
//        autoLoad: true
    });