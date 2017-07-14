Ext.define('acesure.config.store.PasswordUpdateStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.config.model.PasswordUpdateModel', 
    proxy:{
    	type : 'ajax',
		url : '/config/toSystemConfigAction!getSystemServerPasswordCheck.action',
		reader : {
			type : 'json',
			root : 'PwdCheckInfo'
		}
   	 }
});

