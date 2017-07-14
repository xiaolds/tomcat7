//备份详情策略
Ext.define('websure.backup.store.StrategyInfoStore', {  
	    extend: 'Ext.data.Store',
        model: 'websure.backup.model.StrategyInfoModel',
        params :{
        	deviceId:-2
        },
        proxy: {  
            type: 'ajax',  
            url: '/backup/tobackupAction!getBackUpStrategyInfo.action',
            reader : {
			  type: 'json', //返回数据类型为json格式
              root: 'detail' //数据
			}
        }
        
//        autoLoad: true
    });