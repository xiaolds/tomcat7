Ext.define('acesure.config.store.RoleGridStore', {
    extend: 'Ext.data.Store',
    pageSize: 15,
    model: 'acesure.config.model.RoleGridModel', 
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':15
    	},
    proxy:{
    	type : 'ajax',
		url : '/authority/toAuthorityAction!getAllRolesBySplitPage.action',
		startParam:'pageBean.firstResult',
	    limitParam:'pageBean.maxResult',
		reader : {
			type : 'json',
			root : 'roleall',
			totalProperty: 'total'
		}
   	 },	  
    autoLoad: true 
});

