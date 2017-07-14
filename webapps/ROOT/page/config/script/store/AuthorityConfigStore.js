Ext.define('acesure.config.store.AuthorityConfigStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.config.model.AuthorityConfigModel',  
    proxy:{
    	type : 'ajax',
		url : '/data/authorityConfigData.json',
		reader : {
			type : 'json'
		}
   	 },	  
    autoLoad: true 
});

