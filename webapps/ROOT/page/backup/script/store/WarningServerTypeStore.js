//备份详情策略
Ext.define('websure.backup.store.WarningServerTypeStore', {  
	    extend: 'Ext.data.Store',
	    alias : 'widget.warningServerTypeStore',
	    fields: [
	         	{ name: 'value', type:'String'},
	         	{ name: 'text', type: 'string' }
	         ],
        proxy: {  
            type: 'ajax',  
            url: '/backup/tomonitorAction!findWarningServerTypeByDeviceId.action',
            reader : {
			  type: 'json', //返回数据类型为json格式
              root: 'data'
			}
        }
   });