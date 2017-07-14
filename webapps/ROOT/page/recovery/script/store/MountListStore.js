/**
 * author:yangbobin date:2015-10-28 
 * description:存储节点下挂载点列表Store
 */
Ext.define('acesure.recovery.store.MountListStore', {
	extend : 'Ext.data.Store',
	model : 'acesure.recovery.model.MountModel',
	alias : 'widget.mountListStore',
	storeId : 'mountId',
	proxy : {
		type : 'ajax',
		url : '/recovery/recoveryAction!showRecoveryMountList.action',
		reader : {
			type : 'json',
			root : 'detail',
			totalProperty : 'total' // 数据总条数
		}
	}
});
