Ext.define('acesure.recovery.store.RecoveryLogStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.recovery.model.StorageLogModel',
    alias:"widget.RecoveryLogStore",
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':15
   	},
    proxy:{
        type:'ajax',
        url : '/syslog/toSystemLog!findStorageLogAllPage.action',
        startParam:'pageBean.firstResult',
        limitParam:'pageBean.maxResult',
        reader: {
            type: 'json',
            root: 'detail',
            totalProperty: 'total' //数据总条数
        }
    },
    pageSize : 15
});
