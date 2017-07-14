Ext.define('acesure.emergency.store.VirtualMachNodeStore', {
	    extend: 'Ext.data.Store',
	    alias: 'widget.virtualMachNodeStore',
	    model: 'acesure.emergency.model.VirtualMachModel',
	    proxy: { 
	        type: 'ajax', 
	        url: emergencyMapDate.EmergencyMapURL('tovmManager','findVmByNodeIdView'),
	        reader: { 
	            type: 'json',
	            root: 'detail'
	        }
	    }
});
