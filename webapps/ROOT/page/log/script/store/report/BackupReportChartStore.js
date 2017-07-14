Ext.define('acesure.store.report.BackupReportChartStore', {
    extend:'Ext.data.Store',
    fields: ['name', 'dateChart', 'maxValue'],
    proxy:{
        type:'ajax',
        url : '/syslog/toSystemBackupLog!findBackupReportLogChart.action',
        reader: {
            type: 'json',
            root: 'detail'
        }
    }
});
