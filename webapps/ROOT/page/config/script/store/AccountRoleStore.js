Ext.define('acesure.config.store.AccountRoleStore', {
    extend: 'Ext.data.Store',
    pageSize: 10,
    model: 'acesure.config.model.AccountRoleModel',   
    proxy:{
    	type : 'ajax',
		url : '/authority/toAuthorityAction!getAllCustomRole',
		reader : {
			type : 'json',
			root : 'roleCustom'
		}
   	 },	  
    autoLoad: true 
});

