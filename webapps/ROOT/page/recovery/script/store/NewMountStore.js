Ext.define('acesure.recovery.store.NewMountStore', {
    extend: 'Ext.data.TreeStore',
    model:"acesure.recovery.model.VmingInfoModel",
    alias:"widget.VmingInfoStore",
    proxy:{
    	type : 'ajax',
		url : '/recovery/mountAction!newMountConfig.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});