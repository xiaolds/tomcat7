Ext.define('acesure.recovery.store.ClusterShareDiskTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.ClusterShareDiskTreeStore",
    proxy:{
    	type : 'ajax',
		url : '/emergency/toclusterVmimg!getClusterShareDiskInfo',
		reader : {
			type : 'json',
			root: 'children'
		}
    },
    autoLoad:false
});