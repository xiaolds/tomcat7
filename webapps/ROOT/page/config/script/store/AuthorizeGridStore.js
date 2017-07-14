Ext.define('acesure.config.store.AuthorizeGridStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.config.model.AuthorizeGridModel',  
    proxy:{
    	type : 'ajax',
		url : '/data/authorizeGridData.json',
		reader : {
			type : 'json'
		}
   	 },	  
    autoLoad: true 
});

