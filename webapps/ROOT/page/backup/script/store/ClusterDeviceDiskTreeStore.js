/**
 * 集群挂载硬盘分区树数据源
 */
Ext.define('websure.backup.store.ClusterDeviceDiskTreeStore', {
    extend: 'Ext.data.TreeStore',
    model:"websure.backup.model.ClusterDiskInfoModel",
    alias:"widget.ClusterDeviceDiskTreeStore",
    proxy:{
    	type : 'ajax',
		url : '/backup/toclusterAction!getClusterDeviceDiskTree.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});