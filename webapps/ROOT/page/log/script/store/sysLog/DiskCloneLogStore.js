Ext.define('acesure.store.sysLog.DiskCloneLogStore',{
	extend: 'Ext.data.Store',
	model: 'acesure.model.sysLog.DiskCloneLogModel',
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':15
   	},
   	proxy:{
        type:'ajax',
        url : '/syslog/toSystemLog!findDiskCloneLogAllPage.action',
        startParam:'pageBean.firstResult',
        limitParam:'pageBean.maxResult',
        reader: {
            type: 'json',
            root: 'detail',
            totalProperty: 'total' //数据总条数
        }
    },
    pageSize : 15
})