Ext.define('acesure.recovery.model.GlobalTreeModel', {
    extend:'Ext.data.TreeModel',
    fields: [{  
        		name : 'deviceId',  
        		type : 'string'  
    		},
    	{ name: 'text', type:'String'},
        { name: 'uuid', type: 'string' },
        { name: 'sysInfo', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'ip', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'type', type: 'string' }
       
    ]
});