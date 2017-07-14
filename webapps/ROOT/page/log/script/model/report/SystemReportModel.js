Ext.define('acesure.model.report.SystemReportModel', {
    extend: 'Ext.data.Model',
    fields: [
       {name: 'deviceTime',			type: 'String'},
       {name: 'deviceHwCpuRate',	type: 'int' },
       {name: 'netUsedRate',		type: 'int' },
       {name: 'diskUsedsize',		type: 'int' }
    ]
});