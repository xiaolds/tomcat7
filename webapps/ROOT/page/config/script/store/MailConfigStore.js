Ext.define('acesure.config.store.MailConfigStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.config.model.MailConfigModel', 
    proxy:{
    	type : 'ajax',
		url : '/config/toSystemConfigAction!getServerMailConfig.action',
		reader : {
			type : 'json',
			root : 'MailConfig'
		}
   	 }
});

