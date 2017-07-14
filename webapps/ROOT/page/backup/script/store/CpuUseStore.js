var CPUData = function(){
		var data = [];
		data :[
		        { rate: 58, chartDate: '8:00' },
		        { rate: 63, chartDate: '9:00' },
		        { rate: 73, chartDate: '10:00' },
		        { rate: 78, chartDate: '11:00' },
		        { rate: 81, chartDate: '12:00' }
		    ]
	return data;
}		



Ext.define('websure.backup.store.CpuUseStore', {
    extend: 'Ext.data.Store',
//    model: 'websure.backup.model.DiskInfoModel',
    fields: ['rate', 'chartDate'],
    data: CPUData/* [
	        { name: 58, data1: '8:00' },
	        { name: 63, data1: '9:00' },
	        { name: 73, data1: '10:00' },
	        { name: 78, data1: '11:00' },
	        { name: 81, data1: '12:00' }
	    ]*//*,
    proxy: {
        type: 'memory',
//	        url : '/data/diskinfoData.js',
        reader: {
            type: 'json',
            root: 'items'
        }
    },
    autoLoad: true*/
});


