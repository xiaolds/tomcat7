Ext.define('acesure.config.store.COMStore', {
    extend: 'Ext.data.Store',
    pageSize: 10,
    model: 'acesure.config.model.COMModel',   
    proxy:{
    	type : 'ajax',
		url : '/config/toSystemConfigAction!getServerSMSCOMs.action',				
		reader : {
			type : 'json',
			root : 'comports'
		}
   	 },	  
    autoLoad: true 
});

