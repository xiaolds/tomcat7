Ext.define('acesure.config.store.AccountAllRoleStore', {
    extend: 'Ext.data.Store',
    pageSize: 10,
    model: 'acesure.config.model.AccountRoleModel',   
    proxy:{
    	type : 'ajax',
		url : '/authority/toAuthorityAction!getAllRole',
		reader : {
			type : 'json',
			root : 'roles'
		}
   	 },	  
    autoLoad: true 
});

