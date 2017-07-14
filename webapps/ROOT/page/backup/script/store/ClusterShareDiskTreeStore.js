/**
 * 集群挂载硬盘分区树数据源
 */
Ext.define('websure.backup.store.ClusterShareDiskTreeStore', {
    extend: 'Ext.data.TreeStore',
    model:"websure.backup.model.ClusterDiskInfoModel",
    alias:"widget.ClusterShareDiskTreeStore",
    proxy:{
    	type : 'ajax',
		url : '/backup/toclusterAction!getClusterShareDiskTree.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});