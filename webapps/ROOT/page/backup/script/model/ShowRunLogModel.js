/**
 * author:yangbobin
 * date:2015-12-30
 */
Ext.define('websure.backup.model.ShowRunLogModel', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'logId', type:'string'},
        { name: 'logpath', type: 'string' },
        { name: 'logName', type: 'string'},
        { name: 'logNameSuffix', type: 'string'},
        { name: 'logSize', type: 'string' },
        { name: 'logModifyTime', type: 'string' }
    ]
});