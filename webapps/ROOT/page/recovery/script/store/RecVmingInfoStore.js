Ext.define('acesure.recovery.store.RecVmingInfoStore', {
    extend: 'Ext.data.TreeStore',
    model:"acesure.recovery.model.VmingInfoModel",
    alias:"widget.RecVmingInfoStore",
    proxy:{
    	type : 'ajax',
		url : '/recovery/mountAction!getRecVmingInfo.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});