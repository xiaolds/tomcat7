Ext.define('acesure.emergency.store.HardDiskDeviceTreeStore', {
	extend: 'Ext.data.TreeStore',
	proxy:{
		type : 'ajax',
		url : '/emergency/tovmManager!getAllDeviceInfo.action',
		reader : {
			type : 'json',
			root: 'children'
		}
	}
});
/*Ext.define('acesure.emergency.store.HardDiskDeviceTreeStore', {
	extend: 'Ext.data.TreeStore',
	alias:"widget.HardDiskDeviceTreeStore",
	proxy:{
		type : 'ajax',
		url : '/emergency/tovmManager!getAllDeviceInfo.action',
		reader : {
			type : 'json',
			root: 'children'
		}
	}
});*/