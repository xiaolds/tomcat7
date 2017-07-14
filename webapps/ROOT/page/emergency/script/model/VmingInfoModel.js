Ext.define('acesure.emergency.model.VmingInfoModel', {
    extend: 'Ext.data.Model',
    alias:"widget.VmingInfoModel",
    fields: [
        { name: 'text', type:'String'},
        { name: 'id', type:'String'},
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
        { name: 'runningStatus', type: 'string' }
    ]
});