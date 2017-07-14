Ext.define('acesure.config.store.RoleDevAuthGridStore', {
    extend : 'Ext.data.Store',
    model : 'acesure.config.model.RoleDevAuthGridModel',
    id : 'roleDevAuthStore',
    proxy : {
    	type : 'ajax',
		url : '/authority/toAuthorityAction!getRoleDevAuthority.action',
		reader : {
			type : 'json',
			root : 'devAuthList'
		}
   	 },	  
    autoLoad: true 
});

