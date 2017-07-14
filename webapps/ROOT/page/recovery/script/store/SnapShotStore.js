//磁盘信息数据集合
Ext.define('acesure.recovery.store.SnapShotStore', {
    extend: 'Ext.data.Store',
    alias:"widget.SnapShotStore",
	storeId : 'SnapShotStoreId',
	model:"acesure.recovery.model.SnapShotModel",
	proxy : {
		type : 'ajax',
		url : '/recovery/mountAction!showSnapShotByDeviceId.action',
		reader : {
			type : 'json',
			root : 'detail',
			totalProperty : 'total'
		}
		
	}
});

