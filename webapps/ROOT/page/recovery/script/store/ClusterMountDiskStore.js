/**
 * 集群挂载硬盘分区树数据源
 */
Ext.define('acesure.recovery.store.ClusterMountDiskStore', {
    extend: 'Ext.data.TreeStore',
    model:"acesure.recovery.model.VmingInfoModel",
    alias:"widget.clusterMountVmimgStore",
    proxy:{
    	type : 'ajax',
		url : '/recovery/mountAction!getClusterMountDiskTree.action',
		reader : {
			type : 'json',
			root: 'children'
		}
    }
});