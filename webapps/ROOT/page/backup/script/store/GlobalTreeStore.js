Ext.define('websure.backup.store.GlobalTreeStore', {
    extend: 'Ext.data.TreeStore',
    proxy:{
    	type : 'ajax',
		url : '/backup/todeviceAction!getDevicesTree.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    },

    autoLoad: true //很关键
});