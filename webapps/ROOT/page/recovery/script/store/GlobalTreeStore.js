Ext.define('acesure.recovery.store.GlobalTreeStore', {
    extend: 'Ext.data.TreeStore',
    proxy:{
    	type : 'ajax',
		url : '/backup/todeviceAction!getOnlyDevicesTree.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    },
    autoLoad: true 
});