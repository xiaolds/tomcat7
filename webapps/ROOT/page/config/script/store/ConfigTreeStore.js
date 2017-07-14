Ext.define('acesure.config.store.ConfigTreeStore', {
    extend: 'Ext.data.TreeStore',
    proxy:{
     
    	type : 'ajax',
		url : '/admin/toMenuAction!showConfigLeftMenu',
		reader : {
			type : 'json',
			root : 'children'
			//successProperty: 'success'  
		}
    },
		root : {
			//id: 'root',
			text : '系统设置树',
			expanded : false
		},

    autoLoad: true 
});