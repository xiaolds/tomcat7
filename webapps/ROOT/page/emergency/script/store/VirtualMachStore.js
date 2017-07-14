Ext.define('acesure.emergency.store.VirtualMachStore', {
	    extend: 'Ext.data.Store',
	    alias: 'widget.virtualMachStore',
	    model: 'acesure.emergency.model.VirtualMachModel',
	    proxy: { 
	        type: 'ajax', 
	        url: emergencyMapDate.EmergencyMapURL('tovmManager','findVmManagerAllView'),
	        reader: { 
	            type: 'json',
	            root: 'detail'
	        }
	    }
     //autoLoad: true
});
