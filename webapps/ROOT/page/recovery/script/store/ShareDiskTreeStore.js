/**
 * 集群挂载硬盘分区树数据源
 */
Ext.define('acesure.recovery.store.ShareDiskTreeStore', {
    extend: 'Ext.data.TreeStore',
    model:"acesure.recovery.model.VmingInfoModel",
    alias:"widget.shareDiskTreeStore",
    proxy:{
    	type : 'ajax',
		url : '/recovery/mountAction!getShareDiskTree.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});