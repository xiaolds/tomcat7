
Ext.define('acesure.store.report.EntireDeviceStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.model.report.EntireDeviceModel',
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':10
   	},
    proxy:{
        type:'ajax',
        url : '/syslog/toSystemEntire!findScatterEntireByDeviceId.action',
        startParam:'pageBean.firstResult',
        limitParam:'pageBean.maxResult',
        reader: {
            type: 'json',
            root: 'detail',
            totalProperty: 'total' //数据总条数
        }
    },
    pageSize : 10// 每页显示条目数量
});
