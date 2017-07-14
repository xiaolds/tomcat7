Ext.define('acesure.store.report.LogTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias:'widget.logTreeStore',
    model: 'acesure.model.report.LogTreeModel',
    proxy:{
    	type : 'ajax',
		url : '/admin/toMenuAction!findLogLeftMenu.action',
		reader : {
			type : 'json',
			root : 'children'
		}
    },
	root : {
		text : '日志模块树',
		expanded : false
	},

    autoLoad: true 
});