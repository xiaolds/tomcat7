
Ext.define('acesure.emergency.store.OtherDeviceHardDiskStore', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.OtherDeviceHardDiskStore",
    proxy:{
    	type : 'ajax',
		url : '/emergency/tovmManager!getHardDiskByDeviceId.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});

