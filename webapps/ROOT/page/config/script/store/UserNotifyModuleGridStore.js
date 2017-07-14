Ext.define('acesure.config.store.UserNotifyModuleGridStore', {
    extend: 'Ext.data.Store',
    pageSize: 10,
    model: 'acesure.config.model.UserNotifyModuleModel',   
    proxy:{
    	type : 'ajax',
		url : '/config/toSystemConfigAction!getCurrentUserNotifyModuleConfigInfo.action',
		reader : {
			type : 'json',
			root : 'UserNotifyModule',
			totalProperty: 'total'
		}
   	 },	  
    autoLoad: true 
});

