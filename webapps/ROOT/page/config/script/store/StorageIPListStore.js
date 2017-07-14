/**
 * 定义存储节点IPList Store
 */
Ext.define('acesure.config.store.StorageIPListStore', {
	extend : 'Ext.data.Store',
	id:'ipListStore',
    fields: [
           {name: 'ipValue', type: 'string'},
           {name: 'ipDisplay',  type: 'string'}
       ],
	proxy : {
		type : 'ajax',
		url : '/config/tostorageConfigAction!getStorageIpList.action',
		reader : {
			type : 'json',
			root: 'ipList'
		}
	}
});
