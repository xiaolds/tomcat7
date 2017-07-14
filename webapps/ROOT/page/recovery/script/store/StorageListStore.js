/**
 * author:yangbobin date:2015-11-16 
 * description:存储节点列表Store
 */
Ext.define('acesure.recovery.store.StorageListStore', {
	extend : 'Ext.data.Store',
	model : 'acesure.recovery.model.StorageModel',
	alias : 'widget.storageListStore',
	storeId : 'storageNodeId',
	proxy : {
		type : 'ajax',
//		url : '/page/recovery/script/store/storageNodeList.json',
		url : '/recovery/tostorageAction!getStorageList.action',
		reader : {
			type : 'json',
			root : 'storageList',
			totalProperty : 'total'    // 数据总条数
		}
	},
	autoLoad : true
});
