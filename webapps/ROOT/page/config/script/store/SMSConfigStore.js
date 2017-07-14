Ext.define('acesure.config.store.SMSConfigStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.config.model.SMSConfigModel', 
    proxy:{
    	type : 'ajax',
		url : '/config/toSystemConfigAction!getServerSMSConfig.action',
		reader : {
			type : 'json',
			root : 'SMSConfig'
		}
   	 }
});

