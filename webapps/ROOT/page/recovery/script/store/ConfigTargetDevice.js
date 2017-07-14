Ext.define('acesure.recovery.store.ConfigTargetDevice', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.ConfigTargetDevice",
    model:"acesure.recovery.model.RemoteMountTargetMacModel",
    proxy : {
		type : 'ajax',
		url : '/recovery/mountAction!getConfigTarDevice.action',
		reader: {
            type: 'json',
            root: 'detail'
	    }
	}
})
