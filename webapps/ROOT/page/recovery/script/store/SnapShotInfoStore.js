//磁盘信息数据集合
Ext.define('acesure.recovery.store.SnapShotInfoStore', {
    extend: 'Ext.data.Store',
    alias:"widget.SnapShotInfoStore",
    model: 'acesure.recovery.model.SnapShotInfoModel',
    groupField:'diskId',
    proxy: {
        type: 'ajax',
	    url : '/recovery/mountAction!getSnapShotInfo.action',
        reader: {
        type: 'json',
        root: 'detail'
        
        }
    }
});

