/**
 * author:yangbobin
 * date:2015-12-30
 */
Ext.define('acesure.recovery.model.DeviceAndVmimgModel', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'deviceId', type:'string'},
        { name: 'name', type: 'string' },
        { name: 'sysType', type: 'string'},
        { name: 'ip', type: 'string' },
        { name: 'usedSize', type: 'string' },
        { name: 'lastSynchTime', type: 'string' },
        { name: 'useType', type: 'string'},
        { name: 'vmimgType', type: 'string'},
        { name: 'diskcloneId', type: 'string'},
        { name: 'snapshotSetId', type: 'string'}
    ]
});