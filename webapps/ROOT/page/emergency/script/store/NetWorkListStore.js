	Ext.define('acesure.emergency.store.NetWorkListStore', {
		extend:"Ext.data.Store",	
	    alias:"widget.NetWorkListStore",
	    model:'acesure.emergency.model.NetWorkListModel',
	    proxy:{
	    	type : 'ajax',
			url : '/emergency/tovmManager!getNetWorkListByDeviceId.action',
			reader : {
				type : 'json',
				root: 'detail'
			}
	    }
	});