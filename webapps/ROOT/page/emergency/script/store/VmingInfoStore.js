Ext.define('acesure.emergency.store.VmingInfoStore', {
    extend: 'Ext.data.TreeStore',
    model:"acesure.emergency.model.VmingInfoModel",
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