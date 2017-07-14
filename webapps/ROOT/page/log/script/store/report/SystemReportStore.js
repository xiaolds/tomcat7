/*var generateData = function(n, floor){
	    var data = [];
	    
	     根据当前时间，计算前24小时 
        var date = new Date ();
		var hours = date.getHours ();
	    
       for(var i = 5; i >= 0; i--){
        	date = new Date ();
			date.setHours(date.getHours () - i);
        	data.push({
				name:date.getHours() + ":00",//当前时间
				data1: Math.random() * 100,
				data2: Math.random() * 100,
				data3: Math.random() * 100
			});
		}
	    
		return data;
};
*/

/*Ext.define('acesure.store.report.SystemReportStore', {
    extend:'Ext.data.Store',
//    model: 'acesure.model.report.SystemReportModel',
//    data: generateData()
    alias:'widget.SystemReportStore',
    fields: ['name', 'data1', 'data2', 'data3'],
    proxy:{
    	type : 'ajax',
		url : '/page/log/script/store/report/systemReport.json',
		reader : {
			type : 'json',
			root : 'data'
		}
    },
    autoLoad: true 
});*/


Ext.define('acesure.store.report.SystemReportStore', {
    extend:'Ext.data.Store',
//    model: 'acesure.model.sysLog.SystemLogModel',
    fields: ['deviceTime', 'deviceHwCpuRate', 'netUsedRate', 'diskUsedsize'],
    proxy:{
        type:'ajax',
//        url : '/syslog/toSystemReport!findSysReportByDeviceId.action',
        url : '/page/log/script/store/report/systemReport.json',
        reader: {
            type: 'json',
            root: 'detail'
        }
    },
    autoLoad: true 
});