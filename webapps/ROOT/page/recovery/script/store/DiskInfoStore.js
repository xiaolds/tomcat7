//磁盘信息数据集合
Ext.define('acesure.recovery.store.DiskInfoStore', {
    extend: 'Ext.data.Store',
    alias:"widget.DiskInfoStore",
    model: 'acesure.recovery.model.DiskInfoModel',
    proxy: {
        type: 'ajax',
	        url : '/recovery/mountAction!getDiskInfo.action',
        reader: {
            type: 'json',
            root: 'detail'
            
        }
    }
});

