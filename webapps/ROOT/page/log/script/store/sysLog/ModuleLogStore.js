var store = Ext.define('acesure.store.sysLog.ModuleLogStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.model.sysLog.SystemLogModel',
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':15
   	},
    proxy:{
        type:'ajax',
        url : '/syslog/toSystemLog!findModuleSystemLogAllPage.action',
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
