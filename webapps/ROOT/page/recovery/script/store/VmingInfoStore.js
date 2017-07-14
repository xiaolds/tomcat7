Ext.define('acesure.recovery.store.VmingInfoStore', {
    extend: 'Ext.data.TreeStore',
    model:"acesure.recovery.model.VmingInfoModel",
    alias:"widget.VmingInfoStore",
    proxy:{
    	type : 'ajax',
		url : '/recovery/mountAction!getVmingInfo.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});