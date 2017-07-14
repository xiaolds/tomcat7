/**
 * author:yangbobin date:2015-11-16 
 * description:存储节点列表Store
 */
Ext.define('acesure.recovery.store.DeviceAndVmimgStore', {
	extend : 'Ext.data.TreeStore',
	model : 'acesure.recovery.model.DeviceAndVmimgModel',
	alias : 'widget.DeviceAndVmimgStore',
	proxy : {
		type : 'ajax',
		url:'/recovery/recoveryAction!loadFileViewInfo.action',
		reader : {
			type : 'json',
			root : 'fileViewInfo'
		},
		extraParams:{  
                symbol:''  
            } 
	}
});
