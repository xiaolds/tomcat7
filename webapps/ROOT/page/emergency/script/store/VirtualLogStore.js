
var store = Ext.define('acesure.emergency.store.VirtualLogStore', {
    extend: 'Ext.data.Store',
    alias:"widget.VirtualLogStore",
    model: 'acesure.emergency.model.VirtualLogModel',
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':15
   	},
    proxy:{
        type:'ajax',
        url : '/syslog/toSystemLog!findEmergencyLogAllPage.action',
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
