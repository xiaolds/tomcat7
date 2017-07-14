Ext.define('acesure.emergency.store.EmergencyInitializeStore', {
		extend:"Ext.data.Store",	
	    alias:"widget.emergencyInitializeStore",
	    model:"acesure.emergency.model.EmergencyInitializeModel",
	    proxy: { 
	        type: 'ajax', 
	        url: emergencyMapDate.EmergencyMapURL('tocomputeNodes','findComputeNodeAllView'),
	        reader: { 
	            type: 'json',
	            root: 'detail'
	        }
	    }
});