
Ext.define('websure.backup.store.ClusterViewDeviceStore', {
    extend: 'Ext.data.Store',
    model: 'websure.backup.model.ClusterViewDeviceModel',
    groupField:'类别',
    proxy: {
         type: 'ajax',  
         url: '/backup/todeviceAction!getClusterDevicesAndSDByClusterId.action',
         reader: { 
	            type: 'json',
	            root: 'children'
	        }
    }
});



