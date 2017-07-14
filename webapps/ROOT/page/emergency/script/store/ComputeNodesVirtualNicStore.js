
Ext.define('acesure.emergency.store.ComputeNodesVirtualNicStore', {
    extend: 'Ext.data.Store',
    alias:"widget.ComputeNodesVirtualNicStore",
    model:"acesure.emergency.model.ComputeNodesVirtualNicModel",
    proxy:{
        type : 'ajax',
        url : '/emergency/tocomputeNodesNic!getComputeNodesVirtualNicByNodeId.action',
        reader : {
            type : 'json',
            root: 'detail'
        }
    }
});
