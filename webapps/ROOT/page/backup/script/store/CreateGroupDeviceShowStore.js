		
Ext.define('websure.backup.store.CreateGroupDeviceShowStore', {
	extend: 'Ext.data.Store',
    storeId:'simpsonsStore',
    fields:['deviceId','deviceName','deviceSys'],
    data:{'items':[
    	
    	]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    },
    autoLoad : true
});