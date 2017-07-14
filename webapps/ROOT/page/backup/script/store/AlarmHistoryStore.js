//备份详情策略
Ext.define('websure.backup.store.AlarmHistoryStore', {  
	    extend: 'Ext.data.Store',
        model: 'websure.backup.model.AlarmHistoryModel',
        params:{
        	'pageBean.firstResult':0,
        	'pageBean.maxResult':10
       	},
        proxy: {  
            type: 'ajax',  
            url: '/backup/tomonitorAction!findAlarmHistoryByDeviceId.action',
            startParam:'pageBean.firstResult',
            limitParam:'pageBean.maxResult',
            reader : {
			  type: 'json', //返回数据类型为json格式
              root: 'detail', //数据
			  totalProperty: 'total' //数据总条数
			}
        },
       pageSize : 9
   });