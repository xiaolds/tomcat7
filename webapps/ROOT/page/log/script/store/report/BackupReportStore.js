Ext.define('acesure.store.report.BackupReportStore', {
    extend:'Ext.data.Store',
    model: 'acesure.model.report.BackupReportModel',
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':10
   	},
    proxy:{
        type:'ajax',
        url : '/syslog/toSystemBackupLog!findBackupReportLogBystates.action',
        startParam:'pageBean.firstResult',
        limitParam:'pageBean.maxResult',
        reader: {
            type: 'json',
            root: 'detail',
            totalProperty: 'total' //数据总条数
        }
    }
//    pageSize : 10// 每页显示条目数量
});