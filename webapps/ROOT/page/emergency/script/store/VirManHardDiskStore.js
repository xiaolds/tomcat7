	Ext.define('acesure.emergency.store.VirManHardDiskStore', {
		extend:"Ext.data.Store",	
	    alias:"widget.virManHardDiskStore",
	    model:'acesure.emergency.model.VirManHardDiskModel',
	    proxy:{
	    	type : 'ajax',
			url : '/emergency/tovmManager!getHardDiskByVirId.action',
			reader : {
				type : 'json',
				root: 'detail'
			}
	    }
	});