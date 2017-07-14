/**
 * 存储节点及路径TreeStore
 */
Ext.define('acesure.config.store.StorageAndPathTreeStore', {
	extend : 'Ext.data.TreeStore',
	model : 'acesure.config.model.StorageAndPathTreeModel',
	storeId: 'storageAndPathTreeStore',
	proxy : {
		type : 'ajax',
		url:'/config/tostorageConfigAction!getStorageAndPathTree.action',
		reader : {
			type : 'json',
			root: 'children'
		}
	}/*,
	autoLoad: true*/
});