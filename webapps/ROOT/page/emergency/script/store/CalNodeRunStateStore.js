
	Ext.define('acesure.emergency.store.CalNodeRunStateStore', {
		extend: 'Ext.data.Store',	
	    model:"acesure.emergency.model.CalNodeRunStateModel",
	    alias:"widget.calNodeRunStateStore",
        proxy:{
        type:'ajax',
        url : '/emergency/tocomputeNodes!showComputeRunState',
           reader:{
            type:'json',
            root:'calculateRunStateInfo'
        }
    }
	});