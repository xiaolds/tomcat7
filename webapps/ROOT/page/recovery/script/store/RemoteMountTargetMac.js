Ext.define('acesure.recovery.store.RemoteMountTargetMac', {
    extend: 'Ext.data.TreeStore',
    alias:"widget.RemoteMountTargetMac",
    model:"acesure.recovery.model.RemoteMountTargetMacModel",
    proxy : {
		type : 'ajax',
		url : '/recovery/mountAction!getTargetDeviceInfo.action',
		reader: {
            type: 'json',
            root: 'detail'
	    }
	}
});
