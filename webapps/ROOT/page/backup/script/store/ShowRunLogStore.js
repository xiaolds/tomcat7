/**
 * author:yangbobin date:2015-11-16 
 * description:存储节点列表Store
 */
Ext.define('websure.backup.store.ShowRunLogStore', {
	extend : 'Ext.data.TreeStore',
	  fields: [  
    	{ name: 'logId', type:'string'},
        { name: 'logpath', type: 'string' },
        { name: 'logName', type: 'string'},
        { name: 'logNameSuffix', type: 'string'},
        { name: 'logSize', type: 'string' },
        { name: 'logModifyTime', type: 'string' }
    ]
});
