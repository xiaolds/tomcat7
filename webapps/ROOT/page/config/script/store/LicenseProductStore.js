Ext.define('acesure.config.store.LicenseProductStore', {
    extend: 'Ext.data.Store',
    pageSize: 15,
    model: 'acesure.config.model.LicenseProductModel', 
    params:{
    	'pageBean.firstResult':0,
    	'pageBean.maxResult':15
    	},
    proxy:{
    	type : 'ajax',
		url : '/config/toLicenseAction!showLicenseProducts.action',
		startParam:'pageBean.firstResult',
	    limitParam:'pageBean.maxResult',
		reader : {
			type : 'json',
			root : 'pids',
			totalProperty: 'total'
		}
   	 },	  
    autoLoad: true 
});

