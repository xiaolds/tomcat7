Ext.define('acesure.config.store.AccountGridStore', {
    extend: 'Ext.data.Store',
    pageSize: 15,
    model: 'acesure.config.model.AccountGridModel', 
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':15
    	},
    proxy:{
    	type : 'ajax',
		url : '/config/toUserConfigAction!getAllUsers.action',
		startParam:'pageBean.firstResult',
	    limitParam:'pageBean.maxResult',
		reader : {
			type : 'json',
			root : 'userall',
			totalProperty: 'total'
		}
   	 },	  
    autoLoad: true 
});

