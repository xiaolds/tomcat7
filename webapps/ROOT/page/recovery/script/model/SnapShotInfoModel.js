Ext.define('acesure.recovery.model.SnapShotInfoModel', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'diskId', type:'String'},
    	{ name: 'snapShotId', type: 'string' },
        { name: 'snapShotName', type: 'string' },
        { name: 'snapShotPath', type: 'string' },
        { name: 'snapShotTime', type: 'string' },
        { name: 'snapShotSize', type: 'string' }
    ]
});