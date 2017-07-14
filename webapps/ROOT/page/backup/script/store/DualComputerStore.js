//磁盘信息数据集合
Ext.define('websure.backup.store.DualComputerStore', {
    extend: 'Ext.data.Store',
    model: 'websure.backup.model.DualComputerModel',
    params :{
        	deviceId:-2,
        	type : 1
        },
    proxy: {
        type: 'ajax',
	    url : '/backup/todeviceAction!getDeviceInfoExceptSelf.action',
	    reader: {
	        type: 'json',
	        root: 'allDevices'
	    }
    },
    autoLoad: true //很关键
});

