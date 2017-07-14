Ext.define('acesure.config.model.RoleDevAuthGridModel', {
    extend : 'Ext.data.Model',      
    fields : [
	          	{ name : 'deviceId', type : 'int' },
	            { name : 'deviceSign', type : 'string' },
	            { name : 'isShow', type : 'boolean' },
	            { name : 'isConfig', type : 'boolean' },
	            { name : 'isStart', type : 'boolean' },
	            { name : 'isSync', type : 'boolean'/*,
                    convert: function (value, record){
                 	   if(value==1){
                 		   return true;
                 	   }else{
                 		   return false;
                 	   }
                    }*/  },
	            { name : 'isSnapshot', type : 'boolean' },
	            { name : 'isCheckdata', type : 'boolean' },
	            { name : 'isInit', type : 'boolean'
	            }
             ]
});


