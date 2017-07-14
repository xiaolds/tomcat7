Ext.define('acesure.recovery.model.VmingInfoModel', {
    extend: 'Ext.data.Model',
    alias:"widget.VmingInfoModel",
    fields: [
        { name: 'text', type:'string'},
        { name: 'id', type:'string'},
    	{ name: 'parId', type:'String'},
    	{ name: 'parStartSec', type: 'string' },
        { name: 'parTotalSec', type: 'string' },
        { name: 'parLetter', type: 'string' },
        { name: 'parFileSystem', type: 'string' },
        { name: 'diskAndVmdkName', type: 'string' },
        { name: 'diskName', type: 'string' },
        { name: 'snapShotName', type: 'string' },
        { name: 'parStartSec', type: 'string' },
        { name: 'snapShotId', type: 'string' },
        { name: 'runningStatus', type: 'string' },
        { name: 'lvmPoint', type: 'string' },
        { name: 'sourceSysType', type: 'string'},
        { name: 'clusterType', type: 'int'}
    ]
});