var MemoryData = function(n, floor){
		var data = []
		
	    // 根据当前时间，计算前12小时 
        var date = new Date ();
		var hours = date.getHours ();
	    floor = (!floor && floor !== 0)? 0 : floor;
	    
        for(var i = 8; i > 0; i--){
        	date = new Date ();
			date.setHours (date.getHours () - i);
        	data.push({
				name:date.getHours()+":00",//当前时间
				data1: Math.floor(Math.max((Math.random() * 100), floor))
			});
		}
		return data;
	};

Ext.define('websure.backup.store.MemoryUseStore', {
    extend: 'Ext.data.JsonStore',
    fields: ['name', 'data1'],
    data: MemoryData(),
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});