Ext.define('acesure.recovery.model.DiskInfoModel', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'diskSel', type:'String'},
    	{ name: 'partId', type: 'string' },
        { name: 'partInfo', type: 'string' },
        { name: 'startSec', type: 'string' },
        { name: 'partSize', type: 'string' },
        { name: 'zonedFormat', type: 'string' },
        { name: 'runningStatus', type: 'string' }/*,
        { name: 'userState', type: 'string' },
        { name: 'userPhone', type: 'string' },
        { name: 'userSex', type: 'string'},
        { name: 'userBirthday', type: 'string' ,convert:function(v,rec){var date = rec.raw.userBirthday;return date.substring(0,10);}},
        { name: 'userAddress', type: 'string' },
        { name: 'userMail', type: 'string' },
        { name: 'userDescription', type: 'string' },
        { name: 'isLock', type: 'string' }*/
    ]
});