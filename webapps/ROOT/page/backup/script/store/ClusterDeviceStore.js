
Ext.define('websure.backup.store.ClusterDeviceStore', {
    extend: 'Ext.data.Store',
    model: 'websure.backup.model.ClusterDeviceModel',
    proxy: {
         type: 'ajax',  
         url: '/backup/todeviceAction!getClusterDevicesByClusterId.action',
         reader: { 
	            type: 'json',
	            root: 'children'
	        }
    }
});



